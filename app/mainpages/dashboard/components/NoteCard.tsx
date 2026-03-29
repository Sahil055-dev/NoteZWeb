import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Eye } from "lucide-react";

interface NoteCardProps {
  noteId?: string;
  title: string;
  subject: string;
  topic: string;
  author: string;
  downloads: number;
  date: string;
  isBookmarked?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onBookmarkToggle?: (e: React.MouseEvent) => void;
}

const NoteCard = ({
  noteId,
  title,
  subject,
  topic,
  author,
  downloads,
  date,
  isBookmarked = false,
  compact = false,
  onClick,
  onBookmarkToggle,
}: NoteCardProps) => {
  return (
    <Card
      className={`group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 ${
        compact ? "h-auto" : "h-full"
      }`}
      onClick={onClick}
    >
      <CardContent
        className={`h-full flex flex-col justify-between ${
          compact ? "p-2.5 gap-1" : "p-3"
        }`}
      >
        <div className={compact ? "space-y-1" : "space-y-2"}>
          {/* Header */}
          <div className="flex items-start justify-between min-w-0">
            <div className="min-w-0 mr-2">
              <h4
                className={`font-medium text-foreground truncate group-hover:text-primary transition-colors ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {title}
              </h4>
              {!compact && (
                <p className="text-xs text-muted-foreground truncate">
                  {topic}
                </p>
              )}
            </div>
            {/* Bookmark Icon */}
            <button
              onClick={onBookmarkToggle}
              className={`shrink-0 rounded-full hover:bg-muted/50 transition-colors ${
                compact ? "p-1" : "p-1.5"
              }`}
            >
              <Bookmark
                className={`transition-all ${
                  compact ? "h-3 w-3" : "h-4 w-4"
                } ${
                  isBookmarked
                    ? "fill-primary text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
            </button>
          </div>

          {/* Badge */}
          {!compact && (
            <div>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 font-normal text-wrap"
              >
                {subject}
              </Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between border-t border-border/50 text-muted-foreground ${
            compact
              ? "mt-1.5 pt-1.5 text-[9px]"
              : "mt-3 pt-2 text-[10px]"
          }`}
        >
          <span className="truncate w-2/5">by {author}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
              {downloads}
            </span>
            {!compact && <span>{date}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
