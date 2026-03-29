import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User2, Calendar, Eye, BookOpenText, Bookmark, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/app/API/supabase";
import { toast } from "sonner";
import Link from "next/link";

interface NoteSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDocument?: () => void;
  note: {
    id: string;
    title: string;
    subject: string;
    topic: string;
    author: string;
    downloads: number;
    views_count?: number;
    date: string;
    description?: string;
    file_path?: string;
  } | null;
}

export default function NoteSummaryDialog({
  isOpen,
  onClose,
  note,
  onViewDocument,
}: NoteSummaryDialogProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      checkIfBookmarked(note.id);
    }
  }, [isOpen, note]);

  const checkIfBookmarked = async (noteId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("bookmarks")
        .select("note_id")
        .eq("user_id", session.user.id)
        .eq("note_id", noteId)
        .single();
      setIsBookmarked(!!data);
    } catch {
      setIsBookmarked(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!note || bookmarkLoading) return;
    setBookmarkLoading(true);
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to bookmark a note.");
        setIsBookmarked(previousState);
        return;
      }
      if (!previousState) {
        const { error } = await supabase.from("bookmarks").insert({ user_id: session.user.id, note_id: note.id });
        if (error) throw error;
        toast.success("Bookmark added!");
      } else {
        const { error } = await supabase.from("bookmarks").delete().eq("user_id", session.user.id).eq("note_id", note.id);
        if (error) throw error;
        toast.success("Bookmark removed!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update bookmark");
      setIsBookmarked(previousState);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleViewClick = async () => {
    if (!note) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Increment view count via RPC
      await supabase.rpc("increment_view_count", { p_note_id: note.id });

      // Upsert recently viewed
      await supabase.from("recently_viewed").upsert(
        {
          user_id: session.user.id,
          note_id: note.id,
          viewed_at: new Date().toISOString(),
        },
        { onConflict: "user_id, note_id" }
      );

      onViewDocument?.();
    } catch (err) {
      console.error("Error tracking view:", err);
    }
  };

  const viewerUrl = note?.file_path
    ? `/mainpages/studysession?file=${encodeURIComponent(note.file_path)}&noteId=${note.id}`
    : "#";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-6 flex flex-col gap-4"
            >
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-xl">{note?.title || "Note Title"}</DialogTitle>
                  <button
                    onClick={handleToggleBookmark}
                    disabled={bookmarkLoading}
                    className={`p-2 shrink-0 rounded-full transition-colors ${
                      isBookmarked ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {bookmarkLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary" : ""}`} />
                    )}
                  </button>
                </div>
                
                <div className="flex md:justify-start justify-start gap-2 text-xs lg:text-sm my-4">
                  <p className="bg-primary/20 rounded-xl px-2.5 py-1 w-fit text-primary font-medium">
                    {note?.subject || "Subject"}
                  </p>
                  <p className="bg-secondary/10 rounded-xl px-2.5 py-1 w-fit text-secondary font-medium">
                    {note?.topic || "Topic"}
                  </p>
                </div>
                <DialogDescription asChild>
                  <div className="bg-muted/30 text-foreground text-xs lg:text-sm p-3 rounded-md text-start custom-scrollbar max-h-32 overflow-y-auto leading-relaxed border border-border/50">
                    {note?.description || "No Description Available"}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="my-2 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row justify-items-start text-sm items-start md:items-center justify-between gap-y-2 text-muted-foreground w-full">
                  <span className="flex items-center text-start gap-2 bg-background p-1.5 rounded-md border border-border/40 shrink-0">
                    <User2 size={14} className="text-primary/70" />
                    <span className="truncate max-w-[120px]">
                      <span className="text-foreground font-medium">{note?.author || "Author Name"}</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2 bg-background p-1.5 rounded-md border border-border/40">
                    <Calendar size={14} className="text-primary/70" />
                    <span className="text-foreground">
                      {note?.date || "unavailable"}
                    </span>
                  </span>
                </div>
              </div>
              
              <span className="flex items-center text-sm gap-2 text-muted-foreground">
                <Eye size={16} className="text-primary/70" />
                <span className="font-medium text-foreground">{note?.views_count ?? note?.downloads ?? 0}</span> Views
              </span>

              <DialogFooter className="mt-4">
                <Button asChild type="button" className="w-full sm:w-auto" onClick={handleViewClick}>
                  <Link href={viewerUrl} target="_blank">
                    <BookOpenText className="mr-2 h-4 w-4" /> View Document
                  </Link>
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
