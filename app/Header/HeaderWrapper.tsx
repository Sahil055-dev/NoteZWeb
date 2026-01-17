"use client"
import { usePathname } from "next/navigation";
import MainHeader from "./Header";
import useIsSmallScreen from "../hooks/isSmallScreen";
import { useAuth } from "@/components/context/AuthProvider";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isSmallScreen = useIsSmallScreen();
  const { user, isLoading } = useAuth();
  return <MainHeader isSmallScreen={isSmallScreen} currentPath={pathname} user={user} />  ;
  
}
