import { useEffect, useState } from "react";

export default function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const listener = () =>
      setIsSmall(window.innerWidth < 768); // Tailwind's sm breakpoint

    listener();
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return isSmall;
}