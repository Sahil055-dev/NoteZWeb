import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Download, Eye } from "lucide-react";

interface NoteCardProps {
  title: string;
  subject: string;
  topic: string;
  author: string;
  downloads: number;
  date: string;
  isBookmarked?: boolean;
  onClick?: () => void;
}

const NoteCard = ({
  title,
  subject,
  topic,
  author,
  downloads,
  date,
  isBookmarked = false,
  onClick,
}: NoteCardProps) => {
  return (
    <Card
      className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {topic}
            </p>
          </div>
          <Bookmark
            className={`h-4 w-4 shrink-0 transition-colors ${
              isBookmarked
                ? "fill-primary text-primary"
                : "text-muted-foreground group-hover:text-primary"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {subject}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">by {author}</span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {downloads}
            </span>
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
