"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import NoteCard from "../dashboard/components/NoteCard";
import NoteCardSkeleton from "../dashboard/components/NoteCardSkeleton";
import NoteSummaryDialog from "../dashboard/components/NoteSummaryDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/components/context/AuthProvider";
import supabase from "@/app/API/supabase";
import formatDate from "@/app/utilities/formatDate";
import { studentEducationOptions } from "@/app/data/eduOptions";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 12;

// Collect all unique subject tags from eduOptions
const allSubjects: string[] = Array.from(
  new Set(
    Object.values(studentEducationOptions.educationType).flatMap(
      (group: any) => group.subjectTags || []
    )
  )
).sort();

type SortOption = "views" | "newest" | "oldest";

export default function SearchPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [keyword, setKeyword] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("views");
  const [showFilters, setShowFilters] = useState(true);

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalEstimate, setTotalEstimate] = useState(0);

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // User's own subjects for quick-select chips
  const [userSubjects, setUserSubjects] = useState<string[]>([]);

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

  // Load user's subjects & bookmarks
  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      const [profileRes, bookmarkRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("subjectTags")
          .eq("id", user.id)
          .single(),
        supabase
          .from("bookmarks")
          .select("note_id")
          .eq("user_id", user.id),
      ]);

      if (profileRes.data?.subjectTags) {
        setUserSubjects(profileRes.data.subjectTags);
      }
      if (bookmarkRes.data) {
        setBookmarkedIds(new Set(bookmarkRes.data.map((b: any) => b.note_id)));
      }
    };

    loadUserData();
  }, [user]);

  // Search function
  const searchNotes = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoading(true);

      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("notes")
        .select("*, author:profiles (firstName, lastName)", {
          count: "exact",
        });

      // Apply keyword filter (search in title and topic)
      if (keyword.trim()) {
        query = query.or(
          `title.ilike.%${keyword.trim()}%,topic.ilike.%${keyword.trim()}%`
        );
      }

      // Apply subject filter
      if (selectedSubject) {
        query = query.eq("subject", selectedSubject);
      }

      // Apply sort
      switch (sortBy) {
        case "views":
          query = query.order("views_count", {
            ascending: false,
            nullsFirst: false,
          });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
      }

      query = query.range(from, to);

      const { data, count } = await query;

      const mapped = (data || []).map(mapNote);

      if (append) {
        setNotes((prev) => [...prev, ...mapped]);
      } else {
        setNotes(mapped);
      }

      setTotalEstimate(count || 0);
      setHasMore(mapped.length === PAGE_SIZE && (count || 0) > from + mapped.length);
      setPage(pageNum);
      setLoading(false);
      setInitialLoad(false);
    },
    [keyword, selectedSubject, sortBy]
  );

  // Initial load with most viewed
  useEffect(() => {
    searchNotes(0);
  }, []);

  const handleSearch = () => {
    setPage(0);
    searchNotes(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleViewMore = () => {
    searchNotes(page + 1, true);
  };

  const handleSubjectQuickSelect = (subject: string) => {
    setSelectedSubject(subject);
    setPage(0);
    // We'll trigger search via effect
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedSubject("");
    setSortBy("views");
  };

  // Auto-search when subject or sort changes
  useEffect(() => {
    if (!initialLoad) {
      searchNotes(0);
    }
  }, [selectedSubject, sortBy]);

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

  const hasActiveFilters = keyword.trim() || selectedSubject || sortBy !== "views";

  const renderSkeletonGrid = () => {
    const count = isMobile ? 4 : 12;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <NoteCardSkeleton key={i} compact={isMobile} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background mt-20 md:mt-24">
      <main className="container w-[90%] md:w-5/6 mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Advanced Search
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Find notes by topic, subject, or popularity.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            {/* Search Input Row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-keyword"
                  placeholder="Search by topic or keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={handleSearch} className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                {!isMobile && "Search"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`shrink-0 ${showFilters ? "bg-primary/10 border-primary/50" : ""}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Subject Select */}
                      <div className="flex-1">
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Subject
                        </label>
                        <Select
                          value={selectedSubject}
                          onValueChange={(val) =>
                            setSelectedSubject(val === "__all__" ? "" : val)
                          }
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="All Subjects" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="__all__">All Subjects</SelectItem>
                            {allSubjects.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sort By */}
                      <div className="sm:w-48">
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Sort By
                        </label>
                        <Select
                          value={sortBy}
                          onValueChange={(val) => setSortBy(val as SortOption)}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="views">
                              <span className="flex items-center gap-2">
                                <TrendingUp className="h-3 w-3" /> Most Views
                              </span>
                            </SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quick Subject Chips from User Profile */}
                    {userSubjects.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Your Subjects
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {userSubjects.map((subject) => (
                            <button
                              key={subject}
                              onClick={() => handleSubjectQuickSelect(subject)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
                                selectedSubject === subject
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted/80 hover:text-foreground"
                              }`}
                            >
                              {subject.length > 20
                                ? subject.slice(0, 17) + "..."
                                : subject}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-muted-foreground hover:text-destructive text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Results Info */}
        {!initialLoad && !loading && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {totalEstimate} result{totalEstimate !== 1 ? "s" : ""} found
              </span>
            </div>
            {notes.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Showing {notes.length} of {totalEstimate}
              </span>
            )}
          </div>
        )}

        {/* Results Section */}
        <section className="w-full rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-sm min-h-[400px]">
          {loading && notes.length === 0 ? (
            renderSkeletonGrid()
          ) : notes.length === 0 && !initialLoad ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No results found
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Try adjusting your search terms or filters. You can also browse by
                subject or check out the most viewed notes.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    compact={isMobile}
                    isBookmarked={bookmarkedIds.has(note.id)}
                    onClick={() => handleNoteClick(note)}
                    onBookmarkToggle={(e) =>
                      handleBookmarkToggle(e, note.id)
                    }
                  />
                ))}
              </div>

              {/* View More / Loading More */}
              {loading && notes.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
                      <NoteCardSkeleton key={`loading-${i}`} compact={isMobile} />
                    ))}
                  </div>
                </div>
              )}

              {hasMore && !loading && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={handleViewMore}
                    className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
                  >
                    View More Results
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <NoteSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}
