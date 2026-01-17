import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Clock } from "lucide-react";

interface NoteCardProps {
  title: string;
  subject: string;
  topic: string;
  downloads: number;
  date: string;
  author : string;
  onClick?: () => void;
}

const NoteCard = ({
  title,
  subject,
  topic,
  downloads,
  date,
  author,

  onClick,
}: NoteCardProps) => {
  return (
    <Card
      className="group h-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
      onClick={onClick}
    >
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header */}
          <div className="min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {topic}
            </p>
          </div>

          {/* Badge */}
          <div>
            <Badge 
              variant="secondary" 
              className="text-[10px] px-1.5 py-0 h-5 font-normal text-wrap"
            >
              {subject}
            </Badge>
          </div>
        </div>

        {/* Footer (Downloads + Date only) */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {downloads}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;