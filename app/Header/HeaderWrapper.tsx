"use client"
import { usePathname } from "next/navigation";
import MainHeader from "./Header";
import useIsSmallScreen from "../hooks/isSmallScreen";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isSmallScreen = useIsSmallScreen();

  return <MainHeader isSmallScreen={isSmallScreen} currentPath={pathname} />  ;
  
}
