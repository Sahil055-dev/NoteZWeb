import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User2,
  Calendar,
  Eye,
  BookOpenText,
  Trash2,
  Loader2,
  Edit3,
  Check,
  X
} from "lucide-react";
import formatDate from "@/app/utilities/formatDate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import supabase from "@/app/API/supabase";
import { toast } from "sonner";

interface NoteSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string, filePath: string) => void;
  isDeleting: boolean;
  note: {
    id: string; // Ensure ID is included in the type
    title: string;
    subject: string;
    topic: string;
    author: string | null;
    downloads: number;
    created_at: string;
    description?: string;
    file_path: string;
  } | null;
}

export default function NoteSummaryDialog({
  isOpen,
  onClose,
  note,
  onDelete, // Destructure new prop
  isDeleting,
}: NoteSummaryDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      setEditTitle(note.title);
      setEditDesc(note.description || "");
      setIsEditing(false);
    }
  }, [isOpen, note]);

  const handleSaveEdit = async () => {
    if (!note || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from("notes")
        .update({ title: editTitle, description: editDesc })
        .eq("id", note.id);
      
      if (error) throw error;
      
      toast.success("Note updated successfully!");
      // Directly mutating the note object for optimistic ui
      note.title = editTitle;
      note.description = editDesc;
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update note");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Determine if open state should change
  const formattedDate = note ? formatDate(note.created_at) : "Unknown Date";
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const viewerUrl = note?.file_path
    ? `/mainpages/studysession?file=${encodeURIComponent(note.file_path)}&noteId=${note.id}`
    : "#";
  // const viewerUrl =

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 1. Responsive Dialog Container */}
      <DialogContent className="w-[95vw] border-secondary/10 sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="text-left space-y-4">
          <div className="flex justify-between items-start gap-4">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl md:text-2xl font-bold bg-background border border-primary/50 rounded-md px-3 py-1 outline-none"
                placeholder="Note Title"
              />
            ) : (
              <DialogTitle className="text-xl md:text-2xl leading-tight">
                {note?.title || "Note Title"}
              </DialogTitle>
            )}
            
            <div className="flex shrink-0 items-center justify-center pt-1 md:pr-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} disabled={isSavingEdit} className="text-green-500 hover:text-green-400 bg-background/50 border rounded p-1">
                    {isSavingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsEditing(false)} disabled={isSavingEdit} className="text-red-500 hover:text-red-400 bg-background/50 border rounded p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center bg-background/50 border rounded p-1 shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Tags Section (Wraps nicely on small screens) */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md">
              {note?.subject || "Subject"}
            </span>
            <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-md">
              {note?.topic || "Topic"}
            </span>
          </div>

          {/* 3. Description Section (Scrollable on mobile) */}
          <DialogDescription asChild>
            {isEditing ? (
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full h-32 bg-background border border-primary/50 text-foreground text-sm p-3 rounded-md custom-scrollbar resize-none outline-none"
                placeholder="Note description..."
              />
            ) : (
              <p className="bg-muted/30 wrap-break-word w-full md:h-24 h-32 border border-border/50 text-foreground text-sm p-3 rounded-md text-left max-h-[25vh] custom-scrollbar leading-relaxed">
                {note?.description || "No Description Available"}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* 4. Metadata Section (Clean layout for Author, Date, Views) */}
        <div className=" w-full flex-col my-6  p-3 rounded-md text-sm text-muted-foreground">
          <div className="w-full md:flex justify-between ">
            <div className="flex w-1/2 items-center gap-2">
              <User2 size={16} className="shrink-0 text-primary/70" />
              <span className="truncate">
                By{" "}
                <span className="text-foreground font-medium">
                  {note?.author || "Unknown"}
                </span>
              </span>
            </div>
            <div className="flex w-1/2 items-center gap-2">
              <Calendar size={16} className="shrink-0 text-primary/70" />
              
              <span>Uploaded {formattedDate}</span>
            </div>
          </div>
          <div className="flex w-full mt-2 items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Eye size={16} className="shrink-0 text-primary/70" />
              <span>{note?.downloads || 0} Views</span>
            </span>
          </div>
        </div>

        {/* 5. Footer (Stacks on mobile, row on desktop) */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-auto">
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button asChild className="w-full sm:w-auto flex-1" type="button">
              <Link href={viewerUrl} target="_blank">
                <BookOpenText className="mr-2 h-4 w-4" /> View Document
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto shrink-0"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Note"}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <strong className="text-foreground">{note?.title}</strong>{" "}
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (note?.id && note?.file_path) {
                        onDelete(note.id, note.file_path);
                      }
                    }}
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
