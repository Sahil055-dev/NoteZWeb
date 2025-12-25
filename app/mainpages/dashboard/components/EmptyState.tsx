import { Button } from "@/components/ui/button";
import { FileText, Upload, Search } from "lucide-react";

interface EmptyStateProps {
  type: "notes" | "bookmarks" | "search";
  onAction?: () => void;
}

const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const config = {
    notes: {
      icon: FileText,
      title: "No notes yet",
      description: "Start by uploading your first note or explore what others have shared.",
      actionLabel: "Upload Note",
    },
    bookmarks: {
      icon: FileText,
      title: "No bookmarks",
      description: "Save notes you find useful to access them quickly later.",
      actionLabel: "Explore Notes",
    },
    search: {
      icon: Search,
      title: "No results found",
      description: "Try adjusting your filters or search for something else.",
      actionLabel: "Clear Filters",
    },
  };

  const { icon: Icon, title, description, actionLabel } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      <Button onClick={onAction} className="gap-2">
        <Upload className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
