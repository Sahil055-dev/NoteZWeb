import { Inknut_Antiqua } from "next/font/google";

const inknut = Inknut_Antiqua({
  subsets: ["latin"],
  weight: ["400", "700", "500", "300"],
  variable: "--font-inknut",
});


interface LogoProps {
  size?: "small" | "medium" | "large";
  invert?: boolean;
}

export default function Logo({ size = "medium", invert = false }: LogoProps) {
  // Define text and size variants
  const variants = {
    small: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-2xl",
      zClass: "text-3xl",
    },
    medium: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-4xl",
      zClass: "text-5xl",
    },
    large: {
      note: "NOTE",
      z: "Z", 
      noteClass: "text-5xl",
      zClass: "text-6xl",
    },
  };

  const { note, z, noteClass, zClass } = variants[size];

  return (
    <span
      className={`flex ${inknut.className} justify-center items-baseline select-none`}
    >
      <h2 className={`${noteClass} ${invert ? "text-white" : "text-foreground" }  text-shadow-lg`}>{note}</h2>
      <h2 className={`${zClass} text-yellow-600 text-shadow-xs ml-1`}>{z}</h2>
    </span>
  );
}
