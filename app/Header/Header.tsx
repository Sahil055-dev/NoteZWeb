import Logo from "../Components/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/app/Components/ThemeToggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Menu } from "lucide-react";
import SignInPage from "@/app/Authentication/signinpage/page";
import useIsSmallScreen from "../hooks/isSmallScreen";
import { Bell, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/context/AuthProvider";
import { User } from "@supabase/supabase-js";

interface MainHeaderProps {
  isSmallScreen?: boolean;
  currentPath?: string;
  user: User | null;
}

export default function MainHeader({
  isSmallScreen,
  currentPath,
  user,
}: MainHeaderProps) {
  let initials = "U";
  if (user && user.user_metadata) {
    const firstName = user.user_metadata.firstName || "";
    const lastName = user.user_metadata.lastName || "";
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (currentPath?.includes("/loading") || currentPath?.includes("/studysession")) {
    return null;
  }

  if (user) {
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
          <Link href="../mainpages/dashboard">
            <Logo size={isSmallScreen ? "xsmall" : "small"} />
          </Link>

          {/* 👇 Right section */}
          {!isSmallScreen ? (
            // --- Desktop View ---
            <div className="flex gap-2 md:gap-6 items-center">
              <TooltipProvider>
                {/* Upload Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/mainpages/uploadpage">
                      <Button
                        variant="ghost"
                        className="text-foreground border-primary md:text-md rounded-md hover:bg-primary/20 hover:text-foreground transition"
                      >
                        <FileUp />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-background text-foreground border border-primary/40 shadow-md"
                  >
                    <p>Uploads</p>
                  </TooltipContent>
                </Tooltip>

                {/* Notification Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="items-center text-foreground border-primary md:text-md rounded-md hover:bg-primary/20 hover:text-foreground transition"
                    >
                      <Link href="../">
                        <Bell />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-background text-foreground border border-primary/40 shadow-md"
                  >
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>

                {/* Profile Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex rounded-full w-8 h-8 border-primary bg-primary/50 justify-center items-center border hover:bg-primary-hover transition"
                    >
                      <Link href="../mainpages/profilepage">
                        <p>{initials}</p>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-background text-foreground border border-primary/40 shadow-md"
                  >
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ThemeToggle />
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-background text-foreground border border-primary/40 shadow-md"
                  >
                    <p>Switch Theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
  } else {
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
          <Link href="/mainpages/landingpage">
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
                <Link href="../Authentication/signinpage">Sign In</Link>
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
}
