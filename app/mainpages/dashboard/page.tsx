"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NoteCard from "./components/NoteCard";
import NoteCardSkeleton from "./components/NoteCardSkeleton";
import QuickActions from "./components/QuickActions";
import NoteSummaryDialog from "./components/NoteSummaryDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/components/context/AuthProvider";
import supabase from "@/app/API/supabase";
import formatDate from "@/app/utilities/formatDate";

const Dashboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Recommended section
  const [recommendedNotes, setRecommendedNotes] = useState<Record<string, any[]>>({});
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>("all");
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  // Recently viewed section
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [showAllRecent, setShowAllRecent] = useState(false);

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Helper to map note data
  const mapNote = (n: any) => ({
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
  });

  // Fetch user bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("bookmarks")
      .select("note_id")
      .eq("user_id", user.id);
    if (data) {
      setBookmarkedIds(new Set(data.map((b: any) => b.note_id)));
    }
  }, [user]);

  // Fetch recommended notes per subject
  const fetchRecommended = useCallback(async () => {
    if (!user) return;
    setRecommendedLoading(true);

    // Get user's subject tags
    const { data: profile } = await supabase
      .from("profiles")
      .select("subjectTags")
      .eq("id", user.id)
      .single();

    const subjects: string[] = profile?.subjectTags || [];
    setUserSubjects(subjects);

    const notesMap: Record<string, any[]> = {};

    if (subjects.length > 0) {
      // Fetch "all" tab: mixed results from all subjects
      const { data: allData } = await supabase
        .from("notes")
        .select("*, author:profiles (firstName, lastName)")
        .in("subject", subjects)
        .order("views_count", { ascending: false, nullsFirst: false })
        .limit(8);

      notesMap["all"] = (allData || []).map(mapNote);

      // Fetch per-subject
      await Promise.all(
        subjects.map(async (subject) => {
          const { data } = await supabase
            .from("notes")
            .select("*, author:profiles (firstName, lastName)")
            .eq("subject", subject)
            .order("views_count", { ascending: false, nullsFirst: false })
            .limit(8);

          notesMap[subject] = (data || []).map(mapNote);
        })
      );
    } else {
      // No subjects – show global top
      const { data } = await supabase
        .from("notes")
        .select("*, author:profiles (firstName, lastName)")
        .order("views_count", { ascending: false, nullsFirst: false })
        .limit(8);

      notesMap["all"] = (data || []).map(mapNote);
    }

    setRecommendedNotes(notesMap);
    setActiveSubjectTab("all");
    setRecommendedLoading(false);
  }, [user]);

  // Fetch recently viewed (12 notes)
  const fetchRecent = useCallback(async () => {
    if (!user) return;
    setRecentLoading(true);
    const { data } = await supabase
      .from("recently_viewed")
      .select(
        "note_id, viewed_at, notes:note_id (*, author:profiles (firstName, lastName))"
      )
      .eq("user_id", user.id)
      .order("viewed_at", { ascending: false })
      .limit(12);

    if (data) {
      setRecentNotes(
        data
          .filter((rv: any) => rv.notes)
          .map((rv: any) => mapNote(rv.notes))
      );
    }
    setRecentLoading(false);
  }, [user]);

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([
        fetchRecommended(),
        fetchRecent(),
        fetchBookmarks(),
      ]);
    };
    if (user) loadAll();
  }, [user, fetchRecommended, fetchRecent, fetchBookmarks]);

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (!user) return;

    const wasBookmarked = bookmarkedIds.has(noteId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (wasBookmarked) next.delete(noteId);
      else next.add(noteId);
      return next;
    });

    try {
      if (wasBookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("note_id", noteId);
      } else {
        await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, note_id: noteId });
      }
    } catch {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(noteId);
        else next.delete(noteId);
        return next;
      });
    }
  };

  // Determine visible notes count for recommended
  const getVisibleRecommendedCount = () => {
    if (showAllRecommended) return 8;
    if (isMobile) return 4;
    return 8;
  };

  // Determine visible notes count for recent
  const getVisibleRecentCount = () => {
    if (showAllRecent) return 12;
    if (isMobile) return 4;
    return 12;
  };

  const activeNotes = recommendedNotes[activeSubjectTab] || [];
  const visibleRecommended = activeNotes.slice(0, getVisibleRecommendedCount());
  const hasMoreRecommended = isMobile && activeNotes.length > 4 && !showAllRecommended;

  const visibleRecent = recentNotes.slice(0, getVisibleRecentCount());
  const hasMoreRecent = isMobile && recentNotes.length > 4 && !showAllRecent;

  const renderSkeletonGrid = (count: number, compact?: boolean) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} compact={compact} />
      ))}
    </div>
  );

  const renderCards = (notes: any[], compact?: boolean) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {notes.map((note: any) => (
        <NoteCard
          key={note.id}
          noteId={note.id}
          title={note.title}
          subject={note.subject}
          topic={note.topic}
          author={note.author}
          downloads={note.downloads}
          date={note.date}
          compact={compact}
          isBookmarked={bookmarkedIds.has(note.id)}
          onClick={() => handleNoteClick(note)}
          onBookmarkToggle={(e) => handleBookmarkToggle(e, note.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="flex flex-col items-center mx-auto max-w-7xl px-4 xl:px-8 py-6 gap-8">

        <QuickActions />

        {/* Recommended Section */}
        <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Recommended for You
              </h2>
            </div>

            {/* Subject tabs */}
            {!recommendedLoading && userSubjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveSubjectTab("all");
                    setShowAllRecommended(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    activeSubjectTab === "all"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  All Subjects
                </button>
                {userSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setActiveSubjectTab(subject);
                      setShowAllRecommended(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                      activeSubjectTab === subject
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {subject.length > 25 ? subject.slice(0, 22) + "..." : subject}
                  </button>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {recommendedLoading ? (
              renderSkeletonGrid(isMobile ? 4 : 8, isMobile)
            ) : visibleRecommended.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No notes found for this subject. Try adding subjects in your profile!
              </p>
            ) : (
              <>
                {renderCards(visibleRecommended, isMobile)}

                {hasMoreRecommended && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllRecommended(true)}
                      className="text-primary hover:text-primary/80 gap-1"
                    >
                      View More
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isMobile && showAllRecommended && activeNotes.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllRecommended(false)}
                      className="text-muted-foreground hover:text-foreground gap-1"
                    >
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recently Viewed Section */}
        <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Recently Viewed
              </h2>
              {!recentLoading && recentNotes.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs font-normal">
                  {recentNotes.length} note{recentNotes.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {recentLoading ? (
              renderSkeletonGrid(isMobile ? 4 : 8, isMobile)
            ) : recentNotes.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                You haven't viewed any notes recently. Start exploring!
              </p>
            ) : (
              <>
                {renderCards(visibleRecent, isMobile)}

                {hasMoreRecent && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllRecent(true)}
                      className="text-primary hover:text-primary/80 gap-1"
                    >
                      View More
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isMobile && showAllRecent && recentNotes.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllRecent(false)}
                      className="text-muted-foreground hover:text-foreground gap-1"
                    >
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <NoteSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        note={selectedNote}
        onViewDocument={async () => {
          await fetchRecent();
        }}
      />
    </div>
  );
};

export default Dashboard;
