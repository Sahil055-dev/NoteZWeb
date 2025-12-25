import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Download, Share2, Eye, User, Calendar } from "lucide-react";

interface NotePreviewPanelProps {
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

const NotePreviewPanel = ({ isOpen, onClose, note }: NotePreviewPanelProps) => {
  if (!note) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-foreground">
            {note.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{note.subject}</Badge>
            <Badge variant="secondary">{note.topic}</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>by {note.author}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Uploaded {note.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>{note.downloads} downloads</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-medium text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {note.description ||
                "Comprehensive notes covering all key concepts with diagrams and examples. Perfect for exam preparation."}
            </p>
          </div>

          <div className="aspect-[4/3] rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Preview not available</p>
              <p className="text-xs">Download to view full document</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotePreviewPanel;
