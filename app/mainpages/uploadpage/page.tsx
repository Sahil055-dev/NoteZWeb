"use client";

import React, { useState, useEffect } from "react";
import NoteCard from "./components/NoteCard";
import UploadNoteDialog from "./components/UploadMenu";
import UserNoteDialog from "./components/UserNoteDialog"; // Ensure this matches your filename (UserNoteDialog vs NoteSummaryDialog)
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import supabase from "@/app/API/supabase";
import formatDate from "@/app/utilities/formatDate"
import {Spinner} from "@/components/ui/spinner"

export default function UploadPage() {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [status, setStatus] = useState({
    loading: false,
    notFound: false,
  });

  // --- FIX #1: Convert Author Object to String for the Dialog ---
  const handleNoteClick = (note: any) => {
    // The 'note' object from DB has author as an object: { firstName: '...', lastName: '...' }
    // We must convert it to a string because the Dialog expects a string.
    const authorName = note.author
      ? `${note.author.firstName} ${note.author.lastName}`
      : "Unknown User";

    setSelectedNote({
      ...note,
      author: authorName, // We overwrite the object with the simple string
    });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    setStatus((p) => ({
      ...p,
      loading: true,
    }));
    const fetchNotes = async () => {
      const { data: notes, error } = await supabase
        .from("notes")
        .select(
          `
          *,
          author:profiles (
            firstName,
            lastName,
            universityTier
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        setStatus({ loading: false, notFound: true });

      } else {
        // --- FIX #2: Save the data to State! ---
        setRecentUploads(notes || []);
        setStatus({ loading: false, notFound: notes?.length === 0 });// If no notes, set notFound to true
      }
    };
    
    fetchNotes();
  }, []);

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
            </p>
          </div>

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
            {status.loading ? (
              <div className="mt-36 flex flex-col justify-center items-center md:text-md text-base">
                <Spinner className="md:size-10 size-6 text-secondary mb-2" />
                Loading Your Notes
              </div>
            ) : status.notFound ? (
              <p className="mt-36 text-muted-foreground md:text-md text-base text-center py-10">
                Looks Like You haven't Uploaded Any Notes Yet!
              </p>
            ) : (
              <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {recentUploads.map((n, index) => {
                  // Calculate author name for the CARD display
                  return (
                    <NoteCard
                      key={n.id || index}
                      title={n.title}
                      subject={n.subject}
                      topic={n.topic}
                      downloads={n.downloads}
                      date={formatDate(n.created_at)} // Ensure this matches DB column name
                      author={
                        n.author
                          ? `${n.author.firstName} ${n.author.lastName}`
                          : "Unknown User"
                      } // Pass string to Card
                      onClick={() => handleNoteClick(n)} // Pass original object to Handler
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* View Note Details Dialog */}
      {/* Ensure you are importing the component with the correct name */}
      <UserNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}


