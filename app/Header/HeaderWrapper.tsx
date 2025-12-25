"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MainHeader from "./MainHeader";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // list of paths where we DO NOT want the header
  const noHeaderPaths = ["/testpage"];
  const mainHeaderPath = "/mainpages";

  const shouldShow = !noHeaderPaths.some((p) => pathname.startsWith(p));
  const isMainHeader = pathname.startsWith(mainHeaderPath);

  if (!shouldShow) return null;
  if(isMainHeader){
    return <MainHeader />;
  }
  else{
    return <Header />;
  }
  
}
