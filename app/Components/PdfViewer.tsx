"use client";

import { useRef, useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  MousePointer2,
  Brush,
  Eraser,
  ArrowBigLeft,
  ArrowBigRight,
  ChevronLeft,
  ChevronRight,
  BotMessageSquare
} from "lucide-react";
import ThemeToggle from "./ThemeToggler";
import useIsSmallScreen from "../hooks/isSmallScreen";

// ---------------- PDF WORKER ----------------
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

// ---------------- TYPES ----------------
type Tool = "select" | "brush" | "eraser";

type Stroke = {
  id: string;
  page: number;
  color: string;
  size: number;
  path: string;
};

// ---------------- CONSTANTS ----------------
const COLORS = [
  "#fff59d", // yellow
  "#bbdefb", // blue
  "#c8e6c9", // green
  "#ffcdd2", // red
  "#ffe0b2", // orange
];

const SIZES = [8, 14, 22];
const FIXED_OPACITY = 0.4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;
// ---------------- COMPONENT ----------------
export default function PdfViewer() {
  const isSmallScreen = useIsSmallScreen();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [zoom, setZoom] = useState(1); // 1 = 100%

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [erasing, setErasing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function getPoint(e: React.MouseEvent) {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  // ---------------- MOUSE EVENTS ----------------
  function onMouseDown(e: React.MouseEvent) {
    if (tool === "select") return; // 🔑 allow native selection

    const p = getPoint(e);

    if (tool === "brush") {
      setCurrent({
        id: crypto.randomUUID(),
        page: pageNumber,
        color,
        size,
        path: `M ${p.x} ${p.y}`,
      });
    }

    if (tool === "eraser") {
      setErasing(true);
    }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (tool === "select") return; // 🔑 critical

    const p = getPoint(e);

    if (tool === "brush" && current) {
      setCurrent((prev) =>
        prev ? { ...prev, path: `${prev.path} L ${p.x} ${p.y}` } : prev,
      );
    }

    if (tool === "eraser" && erasing) {
      setStrokes((prev) =>
        prev.filter((stroke) => {
          const points = stroke.path.split("L");
          return !points.some((seg) => {
            const [x, y] = seg.replace("M", "").trim().split(" ").map(Number);
            return Math.hypot(x - p.x, y - p.y) < size;
          });
        }),
      );
    }
  }

  function onMouseUp() {
    if (tool === "select") return; // 🔑

    if (current) {
      setStrokes((prev) => [...prev, current]);
      setCurrent(null);
    }
    setErasing(false);
  }

  function onWheel(e: React.WheelEvent) {
    if (!e.ctrlKey) return;

    e.preventDefault();

    setZoom((z) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.001)),
    );
  }
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
    };

    el.addEventListener("wheel", handler, { passive: false });

    return () => {
      el.removeEventListener("wheel", handler);
    };
  }, []);

  const iconClass = "h-2 w-2 lg:h-4 w-4";
  const BASE_WIDTH = isSmallScreen ? 360 : 535;
  const pageWidth = BASE_WIDTH * zoom;
  // ---------------- RENDER ----------------
  return (
    <div className="flex flex-col mt-2 items-center ">
      {/* Toolbar */}
      <motion.div
        layout
        transition={{
          layout: {
            type: "tween",
            ease: "easeInOut",
            duration: 0.25,
          },
        }}
        className="flex fixed top-1 bg-background/40 backdrop-blur-xs 
        z-50 inset-ring-1 inset-ring-secondary/60 justify-around w-full "
      >
        <motion.div
          layout
          className="flex justify-between fixed top-1  bg-background/60 backdrop-blur-xl items-center gap-2 rounded-md border  p-2 shadow-sm"
        >
          <span className="flex items-center gap-1">
            <Button
              size="icon"
              variant={tool === "select" ? "default" : "ghost"}
              onClick={() => setTool("select")}
            >
              <MousePointer2 className={iconClass} />
            </Button>

            <Button
              size="icon"
              variant={tool === "brush" ? "default" : "ghost"}
              onClick={() => setTool("brush")}
            >
              <Brush className={iconClass} />
            </Button>

            <Button
              size="icon"
              variant={tool === "eraser" ? "default" : "ghost"}
              onClick={() => setTool("eraser")}
            >
              <Eraser className={iconClass} />
            </Button>
            <AnimatePresence initial={false}>
              {tool === "brush" && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 ml-2"
                >
                  <div className="flex gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`h-5 w-5 rounded border ${
                          color === c ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>

                  <select
                    className="rounded-md border bg-background px-2 py-1 text-sm"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                  >
                    <option value={8}>Small</option>
                    <option value={14}>Medium</option>
                    <option value={22}>Large</option>
                  </select>
                </motion.div>
              )}

              {tool === "eraser" && (
                <motion.select
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="ml-2 rounded-md border bg-background px-2 py-1 text-sm"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                >
                  <option value={8}>Small</option>
                  <option value={14}>Medium</option>
                  <option value={22}>Large</option>
                </motion.select>
              )}
            </AnimatePresence>
          </span>
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            >
              −
            </Button>

            <span className="text-xs w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            >
              +
            </Button>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={() => setPageNumber((p) => Math.max(1, p - 2))}
            >
              <ChevronLeft className={iconClass} />
            </Button>
            <motion.div layout="position" className="shrink-0">
              <p className="text-sm xl:text-md  text-center">
                Page {pageNumber} - {pageNumber + 1} / {numPages}
              </p>
            </motion.div>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={() =>
                setPageNumber((p) => Math.min((numPages ?? 1) - 1, p + 2))
              }
            >
              <ChevronRight className={iconClass} />
            </Button>

            <Button variant={"ghost"} className=" hover:bg-primary/10 px-4">
              <BotMessageSquare className={"w-4 h-4 text-primary"} />
               <p className="text-shadow-amber-200 text-secondary/80">
                AI Workspace
                </p>
            </Button>
            <Button variant={"outline"} className="hover:bg-primary/10 px-4">
              Save
            </Button>
            <ThemeToggle />
          </div>
        </motion.div>
      </motion.div>

      <div
        ref={containerRef}
        onWheel={onWheel}
        className={`relative mt-20 ${
          tool === "select" ? "select-text" : "select-none"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Document file="/test.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <div className="w-full ">
            <div className="flex gap-4 w-fit mx-auto">
              {/* LEFT PAGE */}
              <div className="relative border border-secondary/30">
                <Page pageNumber={pageNumber} width={pageWidth} />

                {/* LEFT PAGE HIGHLIGHTS */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                  {[...strokes, ...(current ? [current] : [])]
                    .filter((s) => s.page === pageNumber)
                    .map((s) => (
                      <path
                        key={s.id}
                        d={s.path}
                        stroke={s.color}
                        strokeWidth={s.size}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        fill="none"
                        opacity={FIXED_OPACITY}
                      />
                    ))}
                </svg>
              </div>

              {/* RIGHT PAGE */}
              {pageNumber + 1 <= (numPages ?? 0) && (
                <div className="relative border border-secondary/30">
                  <Page pageNumber={pageNumber + 1} width={pageWidth} />

                  {/* RIGHT PAGE HIGHLIGHTS */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none">
                    {[...strokes, ...(current ? [current] : [])]
                      .filter((s) => s.page === pageNumber + 1)
                      .map((s) => (
                        <path
                          key={s.id}
                          d={s.path}
                          stroke={s.color}
                          strokeWidth={s.size}
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                          fill="none"
                          opacity={FIXED_OPACITY}
                        />
                      ))}
                  </svg>
                </div>
              )}
            </div>
          </div>
        </Document>
      </div>
    </div>
  );
}
