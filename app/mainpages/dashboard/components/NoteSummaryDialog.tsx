import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User2, Calendar, Eye, BookOpenText } from "lucide-react";

interface NoteSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note: {
    title: string;
    subject: string;
    topic: string;
    author: string;
    downloads: number;
    date: string;
    description?: string;
  } | null;
}

export default function NoteSummaryDialog({
  isOpen,
  onClose,
  note,
}: NoteSummaryDialogProps) {
  // Determine if open state should change
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* 1. REMOVED <DialogTrigger>: The parent controls the open state.
          2. REMOVED <form>: Not needed for a view-only summary.
      */}
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
            <span className="flex items-center gap-2">
              Uploaded on
              <Calendar size={12} />
              <p className="text-primary/70">
                {" "}
                {note?.date || "unavailable"}
              </p>{" "}
            </span>
          </span>
        </div>
        <span className="flex items-center text-sm md:text-xs gap-2">
          {" "}
          <Eye size={16} />
          {note?.downloads || 0} Views
        </span>

        <DialogFooter>
          <Button type="button" className="md:w-32">
            <BookOpenText className="mr-2" /> View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
