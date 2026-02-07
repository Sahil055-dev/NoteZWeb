"use client";

import { useRef, useState } from "react";
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

// ---------------- COMPONENT ----------------
export default function PdfViewer() {
  const isSmallScreen = useIsSmallScreen();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);

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
    const p = getPoint(e);

    // draw
    if (tool === "brush" && current) {
      setCurrent((prev) =>
        prev ? { ...prev, path: `${prev.path} L ${p.x} ${p.y}` } : prev,
      );
    }

    // erase
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
    if (current) {
      setStrokes((prev) => [...prev, current]);
      setCurrent(null);
    }
    setErasing(false);
  }
  const iconClass = "h-2 w-2 lg:h-4 w-4"
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
        z-50 inset-ring-1 inset-ring-secondary/60 justify-around w-full lg:w-1/2"
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
              <Brush className={iconClass}   />
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
              variant={"ghost"}
              size="sm"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            >
              <ArrowBigLeft className={iconClass} />
            </Button>
            <span className="xl:text-base text-sm">
              Page {pageNumber} / {numPages}
            </span>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={() =>
                setPageNumber((p) => Math.min(numPages || 1, p + 1))
              }
            >
              <ArrowBigRight className={iconClass} />
            </Button>

            <Button variant={"outline"} className="hover:bg-primary/10 px-4">
              Save
            </Button>
            <ThemeToggle />
          </div>
        </motion.div>
      </motion.div>

      {/* Viewer */}
      <div
        ref={containerRef}
        className={`relative mt-16 border shadow ${
          tool === "select" ? "select-text" : "select-none"
        }`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <Document file="/test.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={isSmallScreen ? 500 : 625} />
        </Document>

        {/* Highlight Layer */}
        <svg className=" absolute inset-0 h-full w-full pointer-events-none">
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
    </div>
  );
}
