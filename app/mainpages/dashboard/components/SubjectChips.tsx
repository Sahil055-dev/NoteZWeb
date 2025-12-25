'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useState } from "react";

const SubjectChips = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Data Structures",
    "Operating Systems",
  ]);

  const allSubjects = [
    "Data Structures",
    "Operating Systems",
    "Database Management",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Web Development",
    "Discrete Mathematics",
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          My Subjects
          <button className="text-primary hover:text-primary/80 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {allSubjects.map((subject) => (
            <Badge
              key={subject}
              variant={selectedSubjects.includes(subject) ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleSubject(subject)}
            >
              {subject}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectChips;
