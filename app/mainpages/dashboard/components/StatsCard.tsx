import { Card, CardContent } from "@/components/ui/card";
import { Upload, Bookmark, TrendingUp } from "lucide-react";

const StatsCard = () => {
  const stats = [
    {
      icon: Upload,
      label: "My Uploads",
      value: "12",
      trend: "+2 this week",
      color: "text-primary",
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      value: "28",
      trend: "+5 this week",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row  items-center gap-3">
              <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="flex flex-col items-center md:flex-none">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;
