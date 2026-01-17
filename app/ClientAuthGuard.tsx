"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthProvider";

export default function ClientAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
const unauthenticatedPaths = ["/", "/Authentication/signinpage", "/Authentication/signuppage"];

  useEffect(() => {
    if (isLoading) return;

    // 🔒 Unauthenticated → only allow landing page
    if (!user && !unauthenticatedPaths.includes(pathname)) {
      router.replace("/");
    }

    // 🚀 Authenticated → skip landing page
    if (user && pathname === "/") {
      router.replace("/mainpages/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) return null;

  return <>{children}</>;
}
