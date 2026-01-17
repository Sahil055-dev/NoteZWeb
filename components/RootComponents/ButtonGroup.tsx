"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import Link from "next/link";
import { Book } from "lucide-react";

export default function RootButtonsGroup({
  type,
}: {
  type: "above" | "below";
}) {
  const { user } = useAuth();

  if (!user && type === "above") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        <Link href="/Authentication/signuppage">
          <Button
            size="lg"
            className="bg-primary hover:opacity-90 font-semibold text-lg h-14 px-8 shadow-glow"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <Link href="/Authentication/signinpage">
          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 hover:bg-primary-hover/10 hover:border-none font-semibold text-lg h-14 px-8 border-2"
          >
            Already Signed Up?
          </Button>
        </Link>
      </div>
    );
  }
  if (user && type === "above") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        <Link href="/mainpages/dashboard">
          <Button
            size="lg"
            className="bg-primary hover:opacity-90 font-semibold text-lg h-14 px-8 shadow-glow"
          >
            Visit Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }
  if (!user && type === "below") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/Authentication/signuppage">
          <Button
            size="lg"
            variant="secondary"
            className="bg-foreground dark:bg-background text-background dark:text-foreground hover:bg-foreground/90 hover:text-primary dark:hover:bg-amber-950/90 dark:hover:text-amber-500 font-semibold text-lg h-14 px-8"
          >
            Sign Up Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <Link href="/Authentication/signinpage">
          <Button
            size="lg"
            variant="outline"
            className="font-semibold text-lg h-14 px-8 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-hover dark:bg-foreground dark:text-background hover:text-primary-hover"
          >
            Sign In to Continue
          </Button>
        </Link>
      </div>
    );
  }
  if (user && type === "below") {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/mainpages/dashboard">
          <Button
            size="lg"
            variant="outline"
            className="font-semibold text-lg h-14 px-8 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-hover dark:bg-foreground dark:text-background hover:text-primary-hover"
          >
            Explore Notes
            <Book></Book>
          </Button>
        </Link>
      </div>
    );
  }
}
