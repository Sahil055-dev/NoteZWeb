import { useState, useEffect } from "react";

export default function useIsTabletPortrait() {
  const [isTabletPortrait, setIsTabletPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      const { innerWidth: w, innerHeight: h } = window;
      setIsTabletPortrait(
        w >= 600 && w <= 1024 && h > w
      );
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isTabletPortrait;
}