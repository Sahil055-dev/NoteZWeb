"use client";

import React, { useState } from "react";
import NoteCard from "./components/NoteCard";
import NoteSummaryDialog from "../dashboard/components/NoteSummaryDialog";
import UploadNoteDialog from "./components/UploadMenu";

export default function UploadPage() {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  // Example recent uploads
  const recentUploads = [
    {
      id: 1,
      title: "Complete Binary Tree Notes",
      subject: "Data Structures",
      topic: "Trees & Graphs",
      author: "Rahul S.",
      downloads: 234,
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Process Scheduling Algorithms",
      subject: "Operating Systems",
      topic: "CPU Scheduling",
      author: "Priya M.",
      downloads: 189,
      date: "3 days ago",
    },
    {
      id: 3,
      title: "Normalization Forms Explained",
      subject: "Database Management",
      topic: "Normalization",
      author: "Amit K.",
      downloads: 312,
      date: "1 week ago",
    },
    {
      id: 4,
      title: "TCP/IP Protocol Stack",
      subject: "Computer Networks",
      topic: "Network Protocols",
      author: "Sara J.",
      downloads: 156,
      date: "5 days ago",
    },
    {
      id: 5,
      title: "React Hooks Deep Dive",
      subject: "Web Development",
      topic: "Frontend",
      author: "John D.",
      downloads: 412,
      date: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20 md:mt-24">
      <main className="container w-5/6 mx-auto px-4 py-6">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Uploads
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
              Contribute to the community by uploading your study materials. 
              Ensure your notes are clear and correctly categorized for easy discovery.
            </p>
          </div>

          {/* New Clean Component Instance */}
          <div className="shrink-0">
            <UploadNoteDialog />
          </div>
        </div>

        <div className="border-t border-border/40 my-6" />

        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
          Recently Uploaded
        </h2>

        {/* Scrollable List Section */}
        <section className="w-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
          <div className="h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {recentUploads.map((n, index) => (
                <NoteCard
                  key={index}
                  title={n.title}
                  subject={n.subject}
                  topic={n.topic}
                  downloads={n.downloads}
                  date={n.date}
                  onClick={() => handleNoteClick(n)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* View Note Details Dialog */}
      <NoteSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}