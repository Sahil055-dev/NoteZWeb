"use client";
import Logo from "../Components/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/app/Components/ThemeToggler";
import { useMediaQuery } from "./MediaQueryHook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Menu } from "lucide-react";
import SignInPage from "@/app/Authentication/SignInPage/page";

export default function Header() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <header
      className="
        fixed top-1 left-1/18 md:top-4 md:left-1/2 md:-translate-x-1/2 w-[90%] md:w-[80%] lg:w-[70%]
        xl:w-[60%] border border-border rounded-2xl 
        bg-background/40 backdrop-blur-xs 
        z-50 inset-ring-1 inset-ring-secondary/60
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link href="../">
          <Logo size={isSmallScreen ? "xsmall" : "small"} />
        </Link>

        {/* 👇 Right section */}
        {!isSmallScreen ? (
          // --- Desktop View ---
          <div className="flex gap-2 md:gap-6 items-center">
            <Button
              variant="ghost"
              className="text-foreground border-primary md:text-md rounded-md hover:bg-primary-hover hover:text-foreground transition"
            >
              <Link href="../Authentication/SignInPage">Sign In</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary-hover text-foreground md:text-md">
              <Link href="../Authentication/signuppage">Sign Up</Link>
            </Button>
            <ThemeToggle />
          </div>
        ) : (
          // --- Mobile View ---
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-background/40 backdrop-blur-sm 
        z-50 inset-ring-1 inset-ring-secondary/60"
            >
              <DropdownMenuItem>Sign In</DropdownMenuItem>
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <ThemeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
