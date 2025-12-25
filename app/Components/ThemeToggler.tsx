"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, SunMedium } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent mismatch on first render
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="ghost"
              className="hover:bg-primary/20"
            >
              {theme === "dark" ? <SunMedium /> : <Moon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-background text-foreground border border-primary/40 shadow-md"
          >
            <p>Switch Theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
