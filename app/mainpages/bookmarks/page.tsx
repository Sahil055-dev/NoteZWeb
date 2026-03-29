"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, BookmarkX } from "lucide-react";
import NoteCard from "../dashboard/components/NoteCard";
import NoteSummaryDialog from "../dashboard/components/NoteSummaryDialog";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import supabase from "@/app/API/supabase";
import formatDate from "@/app/utilities/formatDate";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("note_id, created_at, notes:note_id (*, author:profiles (firstName, lastName))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const ids = new Set<string>();
        const mapped = data
          .filter((b: any) => b.notes)
          .map((b: any) => {
            const n = b.notes;
            ids.add(n.id);
            return {
              id: n.id,
              title: n.title,
              subject: n.subject,
              topic: n.topic,
              author: n.author
                ? Array.isArray(n.author)
                  ? `${n.author[0]?.firstName || ""} ${n.author[0]?.lastName || ""}`.trim() || "Unknown"
                  : `${n.author.firstName || ""} ${n.author.lastName || ""}`.trim() || "Unknown"
                : "Unknown",
              downloads: n.views_count ?? n.downloads ?? 0,
              views_count: n.views_count ?? 0,
              date: formatDate(n.created_at),
              description: n.description,
              file_path: n.file_path,
            };
          });
        setNotes(mapped);
        setBookmarkedIds(ids);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (!user) return;

    // Remove from local state immediately
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    try {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("note_id", noteId);
    } catch {
      // Revert on error
      fetchBookmarks();
    }
  };

  return (
    <div className="min-h-screen bg-background mt-20 md:mt-24">
      <main className="container w-5/6 mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-6 h-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Bookmarks
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Quick access to the notes you've saved for later.
          </p>
        </div>

        <div className="border-t border-border/40 my-6" />

        {/* Content */}
        <section className="w-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner className="w-8 h-8 text-primary mr-2" />
              <span className="text-muted-foreground">Loading bookmarks...</span>
            </div>
          ) : notes.length === 0 ? (
            <Empty className="border border-dashed py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="text-primary p-8 w-16 h-16">
                  <BookmarkX className="w-12 h-12" />
                </EmptyMedia>
                <EmptyTitle>No Bookmarks Yet</EmptyTitle>
                <EmptyDescription>
                  Browse the dashboard and bookmark notes you want to revisit later.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  noteId={note.id}
                  title={note.title}
                  subject={note.subject}
                  topic={note.topic}
                  author={note.author}
                  downloads={note.downloads}
                  date={note.date}
                  isBookmarked={bookmarkedIds.has(note.id)}
                  onClick={() => handleNoteClick(note)}
                  onBookmarkToggle={(e) => handleBookmarkToggle(e, note.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <NoteSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          // Refresh bookmarks on close in case bookmark state changed in dialog
          fetchBookmarks();
        }}
        note={selectedNote}
      />
    </div>
  );
}
