import { useEffect, useState } from "react";

export default function useCanShowTwoPages() {
  const [canShowTwoPages, setCanShowTwoPages] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const isPhone =
        w < 768 ||
        (h < 500 && w < 1024); // 👈 catches S20 Ultra landscape

      const hasEnoughHeight = h > 600;
      const hasEnoughWidth = w > 900;

      setCanShowTwoPages(!isPhone && hasEnoughWidth && hasEnoughHeight);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return canShowTwoPages;
}
