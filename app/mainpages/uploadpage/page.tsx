"use client";

import React, { useState, useEffect } from "react";
import NoteCard from "./components/NoteCard";
import UploadNoteDialog from "./components/UploadMenu";
import UserNoteDialog from "./components/UserNoteDialog"; // Ensure this matches your filename (UserNoteDialog vs NoteSummaryDialog)
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import supabase from "@/app/API/supabase";
import formatDate from "@/app/utilities/formatDate";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/context/AuthProvider";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon } from "lucide-react";

export default function UploadPage() {
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [status, setStatus] = useState({
    loading: false,
    notFound: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  // --- FIX #1: Convert Author Object to String for the Dialog ---
  const handleNoteClick = (note: any) => {
    const authorName = note.author
      ? Array.isArray(note.author)
        ? `${note.author[0]?.firstName || ""} ${note.author[0]?.lastName || ""}`.trim() || "Unknown User"
        : `${note.author.firstName || ""} ${note.author.lastName || ""}`.trim() || "Unknown User"
      : "Unknown User";

    setSelectedNote({
      ...note,
      author: authorName, // We overwrite the object with the simple string
    });
    setIsDialogOpen(true);
  };

const handleDeleteNote = async (noteId: string, filePath: string) => {
    

    setIsDeleting(true);

    try {
      // A. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("note_bucket")
        .remove([filePath]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      }

      // B. Delete from Database
      const { data, error: dbError } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .select(); 

      if (dbError) {
        throw new Error(dbError.message);
      }

      if (!data || data.length === 0) {
        throw new Error(
          "Delete failed. You might not have permission to delete this note."
        );
      }

      // C. Update UI
      toast.success("Note deleted successfully");
      setRecentUploads((prev) => prev.filter((note) => note.id !== noteId));
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Error deleting note");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchNotes = async () => {
    setStatus((p) => ({ ...p, loading: true }));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus({ loading: false, notFound: true });
      return;
    }

    const { data: notes, error } = await supabase
      .from("notes")
      .select(`*, author:profiles (firstName, lastName, universityTier)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      setStatus({ loading: false, notFound: true });
    } else {
      setRecentUploads(notes || []);
      setStatus({ loading: false, notFound: notes?.length === 0 });
    }
  };

  // 2. CALL IT ON MOUNT
  useEffect(() => {
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
            <UploadNoteDialog onUploadSuccess={fetchNotes} />
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
              <Empty className="border border-dashed h-full ">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="text-primary p-8 w-16 h-16"
                  >
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.0001 21L21 16M20.9999 21L16 16"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 13.5V12C20 10.1144 20 9.17157 19.4142 8.58579C18.8284 8 17.8856 8 16 8H14.6569C13.8394 8 13.4306 8 13.0631 7.84776C12.6955 7.69552 12.4065 7.40649 11.8284 6.82843L11.1716 6.17157C10.5935 5.59351 10.3045 5.30448 9.93694 5.15224C9.5694 5 9.16065 5 8.34315 5H8C6.11438 5 5.17157 5 4.58579 5.58579C4 6.17157 4 7.11438 4 9V15C4 16.8856 4 17.8284 4.58579 18.4142C5.17157 19 6.11438 19 8 19H13"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </EmptyMedia>
                  <EmptyTitle>No Files to View</EmptyTitle>
                  <EmptyDescription>
                    Looks like you haven't uploaded anything yet!
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
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
                      downloads={n.views_count ?? n.downloads ?? 0}
                      date={formatDate(n.created_at)}
                      author={
                        n.author
                          ? Array.isArray(n.author)
                            ? `${n.author[0]?.firstName || ""} ${n.author[0]?.lastName || ""}`.trim() || "Unknown User"
                            : `${n.author.firstName || ""} ${n.author.lastName || ""}`.trim() || "Unknown User"
                          : "Unknown User"
                      }
                      onClick={() => handleNoteClick(n)}
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
        onDelete={handleDeleteNote} // <--- Pass the function here
        isDeleting={isDeleting} // <--- Pass the loading state here
      />
    </div>
  );
}
