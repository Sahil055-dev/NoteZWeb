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
  BotMessageSquare,
  SaveIcon,
  ZoomIn,
  ZoomInIcon,
  TextAlignJustify,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ThemeToggle from "./ThemeToggler";
import useIsSmallScreen from "../hooks/isSmallScreen";
import useIsTabletPortrait from "../hooks/isTabletPotrait";
import useCanShowTwoPages from "../hooks/canShowTwoPages";
import { Spinner } from "@/components/ui/spinner";
import supabase from "@/app/API/supabase";
import { toast } from "sonner";
import AiWorkspaceChat from "./AiWorkspaceChat";
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

interface PdfViewerProps {
  fileUrl: string;
  noteId?: string;
}
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
export default function PdfViewer({ fileUrl, noteId }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [activePage, setActivePage] = useState<number | null>(null);

  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [zoom, setZoom] = useState(1); // 1 = 100%

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [erasing, setErasing] = useState(false);
  const [savingStrokes, setSavingStrokes] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = pdfContainerRef.current;
    if (!el) return;

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        // Only set if the selection anchor is inside the PDF container
        if (el.contains(selection.anchorNode)) {
          setSelectedText(selection.toString().trim());
        }
      } else {
        setTimeout(() => {
          if (!window.getSelection()?.toString().trim()) {
            setSelectedText("");
          }
        }, 150);
      }
    };
    el.addEventListener("mouseup", handleMouseUp);
    return () => el.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const canShowTwoPages = useCanShowTwoPages();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function getPoint(e: React.PointerEvent, page: number) {
    const el = pageRefs.current[page];
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in input/select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowRight") {
        if (canShowTwoPages) {
          setPageNumber((p) => Math.min((numPages ?? 1) - 1, p + 2));
        } else {
          setPageNumber((p) => Math.min(numPages ?? 1, p + 1));
        }
      }

      if (e.key === "ArrowLeft") {
        if (canShowTwoPages) {
          setPageNumber((p) => Math.max(1, p - 2));
        } else {
          setPageNumber((p) => Math.max(1, p - 1));
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [numPages, canShowTwoPages]);

  // Load annotations from supabase
  useEffect(() => {
    if (!noteId) return;
    const fetchAnnotations = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data, error } = await supabase
          .from("user_annotations")
          .select("annotations_data")
          .eq("note_id", noteId)
          .eq("user_id", session.user.id)
          .single();
        if (data && data.annotations_data) {
          setStrokes(data.annotations_data as Stroke[]);
        }
      } catch (err) {
        console.error("Error loading annotations:", err);
      }
    };
    fetchAnnotations();
  }, [noteId]);

  // Save annotations to supabase
  const saveAnnotations = async () => {
    if (!noteId) {
      toast.error("Note ID missing, cannot save annotations.");
      return;
    }
    setSavingStrokes(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to save annotations.");
        return;
      }
      
      const { error } = await supabase.from("user_annotations").upsert({
        user_id: session.user.id,
        note_id: noteId,
        annotations_data: strokes,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, note_id' });

      if (error) throw error;
      toast.success("Annotations saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save annotations.");
    } finally {
      setSavingStrokes(false);
    }
  };

  // ---------------- POINTER EVENTS ----------------
  function onPointerDown(e: React.PointerEvent, page: number) {
    if (tool === "select") return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const p = getPoint(e, page);
    if (!p) return;

    setActivePage(page);

    if (tool === "brush") {
      setCurrent({
        id: crypto.randomUUID(),
        page,
        color,
        size,
        path: `M ${p.x} ${p.y}`,
      });
    }

    if (tool === "eraser") setErasing(true);
  }

  function getPageSize(page: number) {
    const el = pageRefs.current[page];
    if (!el) return null;

    return {
      width: el.clientWidth,
      height: el.clientHeight,
    };
  }

  function onPointerMove(e: React.PointerEvent, page: number) {
    if (page !== activePage) return;

    const p = getPoint(e, page);
    if (!p) return;

    if (tool === "brush" && current) {
      setCurrent((prev) =>
        prev ? { ...prev, path: `${prev.path} L ${p.x} ${p.y}` } : prev,
      );
    }

    if (tool === "eraser" && erasing) {
      setStrokes((prev) =>
        prev.filter((stroke) => {
          if (stroke.page !== page) return true;

          return !stroke.path.split("L").some((seg) => {
            const [x, y] = seg.replace("M", "").trim().split(" ").map(Number);
            return Math.hypot(x - p.x, y - p.y) < size;
          });
        }),
      );
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (current) {
      setStrokes((prev) => [...prev, current]);
      setCurrent(null);
    }

    setErasing(false);
    setActivePage(null);
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

  const iconClass = "h-1 w-1 lg:h-4 w-4";
  const BASE_WIDTH = canShowTwoPages
    ? 500
    : Math.min(window.innerWidth - 32, 420);

  const pageWidth = BASE_WIDTH * zoom;
  const isCompactToolbar = window.innerWidth < 1024;

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
        z-50 inset-ring-1 inset-ring-secondary/60 justify-around w-full"
      >
        <motion.div
          layout
          className="flex justify-between fixed top-1 bg-background/60 backdrop-blur-xl items-center gap-2 rounded-md border p-2 shadow-sm"
        >
          <span className="flex items-center gap-1">
            <Button
              size="icon"
              variant={tool === "select" ? "default" : "ghost"}
              onClick={() => setTool("select")}
            >
              <MousePointer2 className={iconClass} />
            </Button>

            {isCompactToolbar ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant={tool === "brush" ? "default" : "ghost"}
                    onClick={() => setTool("brush")}
                  >
                    <Brush className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-48 mt-2 ml-2 space-y-3">
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setTool("brush");
                          setColor(c);
                        }}
                        className={`h-6 w-6 rounded border ${
                          color === c ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>

                  <Select
                    value={String(size)}
                    onValueChange={(value) => setSize(Number(value))}
                  >
                    <SelectTrigger
                      className="
                    w-full bg-background text-sm border border-secondary/30 hover:bg-muted focus:ring-2 focus:ring-primary"
                    >
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>

                    <SelectContent className="bg-background border border-secondary/30 shadow-md">
                      <SelectItem
                        value="8"
                        className="focus:bg-primary/10 data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary"
                      >
                        Small
                      </SelectItem>

                      <SelectItem value="14">Medium</SelectItem>
                      <SelectItem value="22">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                size="icon"
                variant={tool === "brush" ? "default" : "ghost"}
                onClick={() => setTool("brush")}
              >
                <Brush className="h-4 w-4" />
              </Button>
            )}

            {isCompactToolbar ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant={tool === "eraser" ? "default" : "ghost"}
                    onClick={() => setTool("eraser")}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-32  mt-2 ">
                  <Select
                    value={String(size)}
                    onValueChange={(value) => setSize(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>

                    <SelectContent className="bg-background border border-primary/20 shadow-lg rounded-lg">
                      <SelectItem
                        className="text-secondary focus:bg-primary/10 focus:text-primary"
                        value="8"
                      >
                        Small
                      </SelectItem>
                      <SelectItem
                        className="text-secondary focus:bg-primary/10 focus:text-primary"
                        value="14"
                      >
                        Medium
                      </SelectItem>
                      <SelectItem
                        className="text-secondary focus:bg-primary/10 focus:text-primary"
                        value="22"
                      >
                        Large
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                size="icon"
                variant={tool === "eraser" ? "default" : "ghost"}
                onClick={() => setTool("eraser")}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            )}
            {isCompactToolbar ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <ZoomInIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-40 mt-2 p-0.5 flex justify-center items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
                    }
                  >
                    −
                  </Button>

                  <span className="text-xs w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))
                    }
                  >
                    +
                  </Button>
                </PopoverContent>
              </Popover>
            ) : null}
            {!isCompactToolbar && (
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

                    <Select
                      value={String(size)}
                      onValueChange={(value) => setSize(Number(value))}
                    >
                      <SelectTrigger
                        className="
                    w-full bg-background text-sm border border-secondary/30 hover:bg-muted focus:ring-2 focus:ring-primary"
                      >
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>

                      <SelectContent className="bg-background border border-secondary/30 shadow-md">
                        <SelectItem
                          value="8"
                          className="focus:bg-primary/10 data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary"
                        >
                          Small
                        </SelectItem>

                        <SelectItem value="14">Medium</SelectItem>
                        <SelectItem value="22">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {tool === "eraser" && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Select
                      value={String(size)}
                      onValueChange={(value) => setSize(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="8">Small</SelectItem>
                        <SelectItem value="14">Medium</SelectItem>
                        <SelectItem value="22">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </span>
          <div className="flex items-center gap-2 text-sm">
            {!isCompactToolbar ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
                  }
                >
                  −
                </Button>

                <span className="text-xs w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))
                  }
                >
                  +
                </Button>
              </>
            ) : null}
            <Button
              variant={"ghost"}
              size="sm"
              onClick={() => {
                canShowTwoPages
                  ? setPageNumber((p) => Math.max(1, p - 2))
                  : setPageNumber((p) => Math.max(1, p - 1));
              }}
            >
              <ChevronLeft className={iconClass} />
            </Button>
            <motion.div layout="position" className="shrink-0">
              {canShowTwoPages ? (
                <p className="text-sm xl:text-md  text-center">
                  Page {pageNumber} - {pageNumber + 1} / {numPages}
                </p>
              ) : (
                <p className="text-xs sm:text-sm xl:text-md  text-center">
                  Page {pageNumber} / {numPages}
                </p>
              )}
            </motion.div>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={() => {
                canShowTwoPages
                  ? setPageNumber((p) => Math.min((numPages ?? 1) - 1, p + 2))
                  : setPageNumber((p) => Math.min(numPages ?? 1, p + 1));
              }}
            >
              <ChevronRight className={iconClass} />
            </Button>
            {isCompactToolbar ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <TextAlignJustify className={iconClass} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-40 p-0.5 mr-2 mt-2 flex flex-col justify-center items-start">
                  <Button
                    variant={"ghost"}
                    className=" hover:bg-primary/10 px-4"
                    onClick={() => setAiChatOpen(true)}
                  >
                    <BotMessageSquare className={"w-4 h-4 text-primary"} />

                    <p className="ml-2 text-secondary/80">AI Workspace</p>
                  </Button>

                  <Button
                    variant={"ghost"}
                    className="hover:bg-primary/10 px-4"
                    onClick={saveAnnotations}
                    disabled={savingStrokes}
                  >
                    {savingStrokes ? <Spinner className="w-4 h-4 text-primary" /> : <SaveIcon className={iconClass} />}
                    <p className="ml-2 ">Save</p>
                  </Button>
                  <span className="flex items-center text-sm">
                    <ThemeToggle />
                    Switch Theme
                  </span>
                </PopoverContent>
              </Popover>
            ) : (
              <Button 
                variant={"ghost"} 
                className=" hover:bg-primary/10 px-4"
                onClick={() => setAiChatOpen(true)}
              >
                <BotMessageSquare className={"w-4 h-4 text-primary"} />

                <p className="ml-2 text-secondary/80">AI Workspace</p>
              </Button>
            )}
          </div>
          {isCompactToolbar ? null : (
            <>
              <Button 
                variant={"ghost"} 
                className="hover:bg-primary/10 px-4"
                onClick={saveAnnotations}
                disabled={savingStrokes}
              >
                {savingStrokes ? <Spinner className="w-4 h-4 text-primary" /> : <SaveIcon className={iconClass} />}
                <p className="ml-2 ">Save</p>
              </Button>
              <ThemeToggle />
            </>
          )}
        </motion.div>
      </motion.div>

      <AiWorkspaceChat open={aiChatOpen} onOpenChange={setAiChatOpen} noteId={noteId} prefilledText={selectedText} />

      <AnimatePresence>
        {selectedText && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border border-primary/20 shadow-xl rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md"
          >
            <span className="text-sm truncate max-w-[200px] text-muted-foreground italic">"{selectedText}"</span>
            <Button size="sm" onClick={() => setAiChatOpen(true)} className="rounded-full">
              <BotMessageSquare className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={pdfContainerRef}
        className="relative mt-16 border rounded-sm"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex md:w-4xl md:h-165 items-center justify-center md:text-lg text-muted-foreground">
              <Spinner className="size-8 mr-2 text-secondary" />
              Loading PDF…
            </div>
          }
        >
          <div className="w-full max-h-[calc(100vh-120px)] overflow-auto">
            <AnimatePresence mode="wait">
              {canShowTwoPages ? (
                <motion.div
                  key={`spread-${pageNumber}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex gap-4 w-fit mx-auto"
                >
                  {/* LEFT PAGE */}
                  <div className="flex gap-4 w-fit mx-auto">
                    {/* LEFT PAGE */}
                    <div className="relative border border-secondary/30">
                      <div className={tool === "select" ? "" : "pointer-events-none"}>
                        <Page pageNumber={pageNumber} width={pageWidth} />
                      </div>

                      {tool !== "select" && (
                        <div
                          ref={(el) => {
                            pageRefs.current[pageNumber] = el;
                          }}
                          className="absolute inset-0 touch-none"
                          onPointerDown={(e) => onPointerDown(e, pageNumber)}
                          onPointerMove={(e) => onPointerMove(e, pageNumber)}
                          onPointerUp={onPointerUp}
                          onPointerCancel={onPointerUp}
                        />
                      )}

                      {(() => {
                        const size = getPageSize(pageNumber);
                        if (!size) return null;

                        return (
                          <svg
                            className="absolute inset-0 pointer-events-none"
                            width={size.width}
                            height={size.height}
                            viewBox={`0 0 ${size.width} ${size.height}`}
                          >
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
                        );
                      })()}
                    </div>

                    {/* RIGHT PAGE */}
                    {pageNumber + 1 <= (numPages ?? 0) && (
                      <div className="relative">
                        <div className={tool === "select" ? "border border-secondary/30" : "pointer-events-none border border-secondary/30"}>
                          <Page pageNumber={pageNumber + 1} width={pageWidth} />
                        </div>

                        {tool !== "select" && (
                          <div
                            ref={(el) => {
                              pageRefs.current[pageNumber + 1] = el;
                            }}
                            className="absolute inset-0 touch-none"
                            onPointerDown={(e) =>
                              onPointerDown(e, pageNumber + 1)
                            }
                            onPointerMove={(e) =>
                              onPointerMove(e, pageNumber + 1)
                            }
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                          />
                        )}
                        {(() => {
                          const size = getPageSize(pageNumber + 1);
                          if (!size) return null;

                          return (
                            <svg
                              className="absolute inset-0 pointer-events-none"
                              width={size.width}
                              height={size.height}
                              viewBox={`0 0 ${size.width} ${size.height}`}
                            >
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
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ================= SINGLE PAGE MODE ================= */
                <motion.div
                  key={`page-${pageNumber}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    {/* 1️⃣ PDF RENDER */}
                    <div className={tool === "select" ? "" : "pointer-events-none"}>
                      <Page pageNumber={pageNumber} width={pageWidth} />
                    </div>

                    {/* 2️⃣ INTERACTION OVERLAY (only in brush/eraser mode) */}
                    {tool !== "select" && (
                      <div
                        ref={(el) => {
                          pageRefs.current[pageNumber] = el;
                        }}
                        className="absolute inset-0 touch-none select-none"
                        onPointerDown={(e) => onPointerDown(e, pageNumber)}
                        onPointerMove={(e) => onPointerMove(e, pageNumber)}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                      />
                    )}

                    {/* 3️⃣ ANNOTATIONS */}
                    {(() => {
                      const size = getPageSize(pageNumber);
                      if (!size) return null;
                      return (
                        <svg 
                          className="absolute inset-0 pointer-events-none"
                          width={size.width}
                          height={size.height}
                          viewBox={`0 0 ${size.width} ${size.height}`}
                        >
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
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Document>
      </div>
    </div>
  );
}
