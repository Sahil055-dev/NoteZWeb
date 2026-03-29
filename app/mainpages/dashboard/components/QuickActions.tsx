"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Bookmark, Search, UserCircle, ArrowRight, NotebookText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/context/AuthProvider";
import { useEffect, useState } from "react";
import supabase from "@/app/API/supabase";
import { motion } from "framer-motion";

const QuickActions = () => {
  const { user } = useAuth();
  const [uploadCount, setUploadCount] = useState<number | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);
  const [globalCount, setGlobalCount] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fetch total notes globally (does not require auth)
    const fetchGlobal = async () => {
      const { count } = await supabase
        .from("notes")
        .select("id", { count: "exact", head: true });
      if (count !== null) setGlobalCount(count);
    };
    fetchGlobal();

    // 2. Fetch user-specific stats
    if (!user) return;
    const fetchUserStats = async () => {
      const [uploads, bookmarks] = await Promise.all([
        supabase
          .from("notes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("bookmarks")
          .select("note_id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);
      setUploadCount(uploads.count ?? 0);
      setBookmarkCount(bookmarks.count ?? 0);
    };
    fetchUserStats();
  }, [user]);

  const firstName = user?.user_metadata?.firstName || "there";

  const navLinks = [
    {
      icon: Search,
      label: "Search",
      href: "/mainpages/search",
      accent: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "hover:border-sky-500/40",
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      count: bookmarkCount,
      href: "/mainpages/bookmarks",
      accent: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
    },
    {
      icon: UserCircle,
      label: "Profile",
      href: "/mainpages/profilepage",
      accent: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "hover:border-violet-500/40",
    },
  ];

  return (
    <div className="w-full">
      {/* ─── Main hero banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
          {/* decorative gradient blob */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-400/8 blur-2xl" />

          <CardContent className="relative p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

              {/* Left — greeting + subtitle */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Welcome back
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Hey,{" "}
                  <span className="text-primary">
                    {firstName}! 👋
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here's what's happening with your notes today.
                </p>

                {/* Upload count chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-1">
                  {globalCount !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <NotebookText className="w-3 h-3" />
                     Total {globalCount.toLocaleString()} Notes uploaded on 
                    </span>
                  )}
                  {uploadCount !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                      <UserCircle className="w-3 h-3" />
                      You contributed {uploadCount} note{uploadCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Right — primary CTA: Upload */}
              <Link href="/mainpages/uploadpage" className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2.5 font-semibold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                >
                  <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                  Upload a Note
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* ─── Bottom quick-nav row ─── */}
            <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {navLinks.map(({ icon: Icon, label, count, href, accent, bg, border }) => (
                <Link key={label} href={href}>
                  <div
                    className={`group flex items-center justify-center sm:justify-start gap-3 p-3 rounded-xl border border-border/50 bg-background/40 cursor-pointer transition-all duration-200 hover:bg-card hover:shadow-sm ${border}`}
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-lg ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${accent}`} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <p className="font-semibold text-foreground truncate">{label}</p>
                      {count !== undefined && count !== null && (
                        <p className={`text-sm ${accent} font-medium`}>{count} saved</p>
                      )}
                    </div>
                    {/* mobile: simple count display beneath or next to icon */}
                    {count !== undefined && count !== null && (
                      <span className={`sm:hidden ml-1 text-sm font-bold ${accent}`}>{count}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuickActions;
