"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  BookOpen,
  Search,
  Upload,
  Star,
  Bookmark,
  Eye,
  GraduationCap,
  FileText,
  Shield,
  CheckCircle,
  Zap,
  Users,
  Clock,
} from "lucide-react";
import Logo from "./Components/Logo";
import RootButtonsGroup from "@/components/RootComponents/ButtonGroup";
import Link from "next/link";

/* ─── Fade-in-up wrapper ─── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Feature card data (real features) ─── */
const features = [
  {
    icon: GraduationCap,
    title: "Subject-Based Discovery",
    desc: "Filter notes by university, field, year, and subject to find exactly what you need for your curriculum.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Upload,
    title: "Upload & Share Notes",
    desc: "Contribute your own study materials as PDFs and help thousands of fellow students in your stream.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Advanced Search",
    desc: "Search by keyword, topic or subject with powerful filters including sort by most viewed or newest.",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    icon: Bookmark,
    title: "Bookmark Notes",
    desc: "Save notes you love to a personal bookmarks list so you can revisit them anytime, instantly.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Eye,
    title: "In-Browser PDF Viewer",
    desc: "Open and read notes directly in the app with a full built-in PDF viewer — no downloads needed.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "Recently Viewed",
    desc: "Your dashboard tracks the notes you've opened so you can quickly jump back to where you left off.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Star,
    title: "Personalised Feed",
    desc: "Set your subjects in your profile and get a tailored Recommended section on your dashboard.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: FileText,
    title: "AI-Powered Summaries",
    desc: "Open any note in the study session and use the built-in Gemini AI to summarise pages or ask questions.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Shield,
    title: "Dark & Light Mode",
    desc: "Study day or night with a beautiful theme toggle that respects your system preference automatically.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

/* ─── How it works steps ─── */
const steps = [
  { n: "01", title: "Create an account", desc: "Sign up free and set up your profile with your university and subjects." },
  { n: "02", title: "Explore notes", desc: "Browse, search, or filter notes by subject, topic, or most-viewed." },
  { n: "03", title: "Read in-browser", desc: "Click any note to open a preview dialog, then launch the full PDF viewer." },
  { n: "04", title: "Save & come back", desc: "Bookmark favorites and your dashboard tracks everything you've recently viewed." },
  { n: "05", title: "Contribute back", desc: "Upload your own PDFs to give back to the community and build your reputation." },
];

/* ─────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-32 pb-24 px-4">
        {/* subtle grid bg */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]" />

        <div className="max-w-4xl mx-auto text-center space-y-7 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 px-4 py-1.5 text-sm font-medium rounded-full"
            >
              ✦ Mumbai University &amp; Beyond
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <Logo size="large" />
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              Share &amp; Access
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 mt-1">
                Quality University Notes
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A student-driven platform to upload, discover, and study verified
            university notes — with AI assistance built right in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RootButtonsGroup type="above" />
          </motion.div>

          {/* floating stat pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            {[
              { icon: Users, label: "Student Community" },
              { icon: BookOpen, label: "Syllabus-Aligned Notes" },
              { icon: Zap, label: "AI-Powered Study Session" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 border border-border/60 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ FEATURES GRID ══════════ */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14 space-y-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-widest">
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Everything you need to study smarter
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for university students — every feature exists to save you time
              and help you find what you need, fast.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <FadeUp key={title} delay={i * 0.05}>
                <Card className="group h-full border-border/50 bg-card/60 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-5 space-y-3">
                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.6} />
                    </div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-14 space-y-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-widest">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Get started in minutes
            </h2>
          </FadeUp>

          <div className="relative">
            {/* vertical connector line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border/60 hidden sm:block" />

            <div className="space-y-8">
              {steps.map(({ n, title, desc }, i) => (
                <FadeUp key={n} delay={i * 0.08}>
                  <div className="flex gap-5 items-start">
                    <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm">
                      {n}
                    </div>
                    <div className="pt-2">
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHY CONTRIBUTE ══════════ */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14 space-y-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-widest">
              Contribute
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Why share your notes?
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { emoji: "🤝", title: "Help Others Excel", desc: "Your notes can be the difference between a student passing or failing. Real impact." },
              { emoji: "⭐", title: "Build a Reputation", desc: "Become a top contributor in your subject. Your name sits on every note you upload." },
              { emoji: "🧠", title: "Reinforce Your Knowledge", desc: "Writing structured notes is the single best way to solidify your own understanding." },
              { emoji: "🔓", title: "Unlock More Content", desc: "Active contributors get priority access to newly uploaded materials as the library grows." },
            ].map(({ emoji, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.07}>
                <Card className="group border-border/50 bg-card/60 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <span className="text-3xl mt-0.5">{emoji}</span>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,hsl(var(--primary)/0.12),transparent)]" />
        <FadeUp className="max-w-2xl mx-auto text-center space-y-7 relative">
          <Logo size="medium" />
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Ready to study smarter?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the growing community of students who upload, discover, and learn
            together on NoteZ.
          </p>
          <RootButtonsGroup type="below" />
        </FadeUp>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-border/40 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="small" />
          <p className="text-sm text-muted-foreground text-center">
            © 2025 NoteZ — Empowering students through shared knowledge.
          </p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/Authentication/signinpage" className="hover:text-foreground transition-colors">Sign In</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/Authentication/signuppage" className="hover:text-foreground transition-colors">Sign Up</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/mainpages/search" className="hover:text-foreground transition-colors">Search</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
