"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Bell,
  User,
  Menu,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import NoteCard from "./components/NoteCard";
import QuickActions from "./components/QuickActions";
import NoteSummaryDialog from "./components/NoteSummaryDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/components/context/AuthProvider";
import { toast } from "sonner"


const Dashboard = () => {
  const { user } = useAuth();

  const [selectedNote, setSelectedNote] = useState<any>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMobile = useIsMobile();

  const recommendedNotes = [
    {
      id: 1,
      title: "Complete Binary Tree Notes",
      subject: "Data Structures",
      topic: "Trees & Graphs",
      author: "Rahul S.",
      downloads: 234,
      date: "2 days ago",
      isBookmarked: true,
    },
    {
      id: 2,
      title: "Process Scheduling Algorithms",
      subject: "Operating Systems",
      topic: "CPU Scheduling",
      author: "Priya M.",
      downloads: 189,
      date: "3 days ago",
      isBookmarked: false,
    },
    {
      id: 3,
      title: "Normalization Forms Explained",
      subject: "Database Management",
      topic: "Normalization",
      author: "Amit K.",
      downloads: 312,
      date: "1 week ago",
      isBookmarked: true,
    },
    {
      id: 4,
      title: "TCP/IP Protocol Stack",
      subject: "Computer Networks",
      topic: "Network Protocols",
      author: "Sara J.",
      downloads: 156,
      date: "5 days ago",
      isBookmarked: false,
    },
  ];

  const recentNotes = [
    {
      id: 5,
      title: "Dijkstra's Algorithm Implementation",
      subject: "Data Structures",
      topic: "Graph Algorithms",
      author: "Vikram P.",
      downloads: 98,
      date: "1 hour ago",
      isBookmarked: false,
    },
    {
      id: 6,
      title: "Memory Management Techniques",
      subject: "Operating Systems",
      topic: "Memory Management",
      author: "Neha R.",
      downloads: 67,
      date: "3 hours ago",
      isBookmarked: false,
    },
    {
      id: 7,
      title: "SQL Joins Cheatsheet",
      subject: "Database Management",
      topic: "SQL Queries",
      author: "Karan M.",
      downloads: 145,
      date: "6 hours ago",
      isBookmarked: true,
    },
    {
      id: 7,
      title: "SQL Joins Cheatsheet",
      subject: "Database Management",
      topic: "SQL Queries",
      author: "Karan M.",
      downloads: 145,
      date: "6 hours ago",
      isBookmarked: true,
    },
  ];

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      {/* Header */}

      {/* Main Content */}
      <main className="flex flex-col justify-center items-center mx-auto px-4 py-6 gap-6">
        {/* Welcome Section */}
        <div className=" flex flex-col justify-center items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aloha!{" "}
            <span className="text-primary text-shadow-xs text-shadow-amber-600">
              {user?.user_metadata?.firstName || "User"}
      
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 text-center">
            Here's what's happening with your notes today.
          </p>
        </div>

        {/* Top Row: Stats + Subjects + Quick Actions */}

        <QuickActions />

        {/* Notes Catalogue - Full Width */}
        <Card className="w-5/6  border-border/50 bg-card/50 backdrop-blur-sm">
          <Tabs defaultValue="recommended" className="w-full">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="recommended" className="gap-2">
                    <Star className="h-4 w-4" />
                    {isMobile ? "" : "Recommended"}
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="gap-2">
                    <Clock className="h-4 w-4" />
                    {isMobile ? "" : "Recent"}
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {isMobile ? "" : "Trending"}
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="recommended" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recommendedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      {...note}
                      onClick={() => handleNoteClick(note)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="recent" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      {...note}
                      onClick={() => handleNoteClick(note)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="trending" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...recommendedNotes]
                    .sort((a, b) => b.downloads - a.downloads)
                    .map((note) => (
                      <NoteCard
                        key={note.id}
                        {...note}
                        onClick={() => handleNoteClick(note)}
                      />
                    ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>

      {/* Note Preview Panel */}
  
      <NoteSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        note={selectedNote}
      />

    </div>
  );
};

export default Dashboard;
