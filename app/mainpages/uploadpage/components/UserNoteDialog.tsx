import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User2, Calendar, Eye, BookOpenText, Trash2, Loader2 } from "lucide-react";
import formatDate from "@/app/utilities/formatDate";

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
  onDelete,     // Destructure new prop
  isDeleting,
}: NoteSummaryDialogProps) {
  // Determine if open state should change
  const formattedDate = note ? formatDate(note.created_at) : "Unknown Date";
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{note?.title || "Note Title"}</DialogTitle>
          <div className="flex md:justify-start justify-center gap-2 text-xs lg:text-sm my-4 ">
            <p className="bg-primary/20 rounded-xl px-1.5 w-fit text-primary">
              {note?.subject || "Subject"}
            </p>

            <p className="bg-primary/20 rounded-xl px-1.5 w-fit text-secondary">
              {note?.topic || "Topic"}
            </p>
          </div>
          <DialogDescription asChild>
            {/* Added asChild to avoid p inside p warning if description contains blocks */}
            <div className="bg-primary/10 text-foreground text-xs lg:text-sm p-2 rounded-md text-start">
              {note?.description || "No Description Available"}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex gap-2">
          <span className="flex flex-col md:flex-row justify-items-start text-xs lg:text-md items-center text-wrap justify-center gap-2 text-muted-foreground ">
            <span className="flex items-center text-start gap-2">
              By <User2 size={12} />
              <p className="text-primary text-wrap text-start">
                {note?.author || "Author Name"}
              </p>{" "}
            </span>
            Uploaded on
            <Calendar size={12} />
            <p className="text-primary/70">{formattedDate}</p>
          </span>
        </div>
        <span className="flex items-center text-sm md:text-xs gap-2">
          {" "}
          <Eye size={16} />
          {note?.downloads || 0} Views
        </span>

        <DialogFooter>
          <div className="w-full flex justify-between">
            <div className="flex gap-2">
              <Button type="button" className="md:w-32">
                <BookOpenText className="mr-2" /> View
              </Button>
              <Button
                type="button"
                variant={"destructive"}
                size={"icon"}
                disabled={isDeleting} // Disable while processing
                onClick={() => {
                  if (note?.id && note?.file_path) {
                    onDelete(note.id, note.file_path);
                  }
                }}
              >
                {isDeleting ? (
                  <Loader2 className="m-2 animate-spin" />
                ) : (
                  <Trash2 className="m-2" />
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
