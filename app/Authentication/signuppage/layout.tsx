"use client";
import { useAuth } from "@/components/context/AuthProvider";
import Loading from "./loading";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // 1. Do nothing while Supabase is still checking session
    if (isLoading) return <Loading/>;

    // Helper: Check if we are currently on the details page
    // (Adjust string to match your exact URL structure)
    const isOnDetailsPage = pathname.includes("/detailspage");

    // --- CASE A: User is NOT Logged In ---
    if (!user) {
      // If they try to force-visit detailspage without an account, kick them back to signup
      if (isOnDetailsPage) {
        router.replace("/signuppage/detailspage"); // Use replace to clear history
      }
      return;
    }

    // --- CASE B: User IS Logged In ---
    if (user) {
      const areDetailsFilled = user.user_metadata?.areDetailsFilled;

      if (areDetailsFilled) {
        // 1. Profile Complete? -> Go to Dashboard immediately
        router.replace("/mainpages/dashboard");
      } else {
        // 2. Profile Incomplete? -> Must go to Details Page
        if (!isOnDetailsPage) {
          router.replace("/Authentication/signuppage/detailspage");
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  // Show Loading while auth is initializing
  if (isLoading) {
    return <Loading />;
  }

  // --- FLASH PREVENTION ---
  // If we are about to redirect (e.g. user is logged in but on the wrong page),
  // return Loading or null to prevent the wrong page from "flashing" for a split second.
  
  const isOnDetailsPage = pathname.includes("/detailspage");
  const areDetailsFilled = user?.user_metadata?.areDetailsFilled;

  if (user && areDetailsFilled) return <Loading />;

  if (user && !areDetailsFilled && !isOnDetailsPage) return <Loading />;

  // Prevent guests from seeing the details page
  if (!user && isOnDetailsPage) return <Loading />;


  return <>{children}</>;
}