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
} from "lucide-react";
import formatDate from "@/app/utilities/formatDate";
import Link from "next/link";

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
  // Determine if open state should change
  const formattedDate = note ? formatDate(note.created_at) : "Unknown Date";
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const viewerUrl = note?.file_path
    ? `/mainpages/studysession?file=${encodeURIComponent(note.file_path)}`
    : "#";
  // const viewerUrl =

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 1. Responsive Dialog Container */}
      <DialogContent className="w-[95vw] border-secondary/10 sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="text-left space-y-4">
          <DialogTitle className="text-xl md:text-2xl leading-tight">
            {note?.title || "Note Title"}
          </DialogTitle>

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
            <p className="bg-muted/30  wrap-break-word w-full md:h-24 h-32 border border-border/50 text-foreground text-sm p-3 rounded-md text-left max-h-[25vh] custom-scrollbar leading-relaxed">
              {note?.description || "No Description Available"}
            </p>
          </DialogDescription>
        </DialogHeader>

        {/* 4. Metadata Section (Clean layout for Author, Date, Views) */}
        <div className=" w-full flex gap-3 my-6  p-3 rounded-md text-sm text-muted-foreground">
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
            <span>{formattedDate}</span>
          </div>
          <div className="flex w-1.2 items-center gap-2 sm:col-span-2">
            <Eye size={16} className="shrink-0 text-primary/70" />
            <span>{note?.downloads || 0} Views</span>
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
