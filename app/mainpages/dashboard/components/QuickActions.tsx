import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, MessageSquarePlus } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Upload,
      label: "Upload Note",
      description: "Share your notes",
      variant: "default" as const,
    },
    {
      icon: FileText,
      label: "Create Summary",
      description: "Summarize a topic",
      variant: "secondary" as const,
    },
    {
      icon: MessageSquarePlus,
      label: "Request Topic",
      description: "Ask for notes",
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="w-5/6 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8">
        <Button
          variant="default"
          className="w-5/6 md:w-1/4 flex justify-center gap-3 h-auto p-3 "
          asChild
        >
          <div className="flex items-center gap-2 lg:gap-4 cursor-pointer">
            <Upload
              className=" min-w-[24px] min-h-[24px] lg:min-w-[24px] lg:min-h-[24px]"
              strokeWidth={1.5}
            />
            <div className="flex flex-col">
              <span className="font-bold lg:text-lg text-sm">Upload Notes</span>
              <span className="lg:text-sm text-xs opacity-70"> Share Your Notes</span>
            </div>
          </div>
        </Button>
        <Button
          variant="secondary"
          className="w-5/6 md:w-1/4 flex justify-center gap-3 h-auto p-3 "
          asChild
        >
          <div className="flex items-center gap-2 lg:gap-4 cursor-pointer">
            <FileText
              className=" min-w-[24px] min-h-[24px] lg:min-w-[24px] lg:min-h-[24px]"
              strokeWidth={1.5}
            />
            <div className="flex flex-col">
              <span className="font-bold lg:text-lg text-sm">Summarize</span>
              <span className="lg:text-sm text-xs opacity-70"> Summarize a topic</span>
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-5/6 md:w-1/4 flex justify-center gap-3 h-auto p-3 "
          asChild
        >
          <div className="flex items-center gap-2 lg:gap-4 cursor-pointer">
            <MessageSquarePlus
              className=" min-w-[24px] min-h-[24px] lg:min-w-[24px] lg:min-h-[24px]"
              strokeWidth={1.5}
            />
            <div className="flex flex-col">
              <span className="font-bold lg:text-lg text-sm">Request Topic</span>
              <span className="lg:text-sm text-xs opacity-70"> Ask for notes</span>
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
