


interface LogoProps {
  size?: "xsmall"| "small" | "medium" | "large";
  invert?: boolean;
}

export default function Logo({ size = "medium", invert = false }: LogoProps) {
  // Define text and size variants
  const variants = {
    xsmall: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-md",
      zClass: "text-lg",
    },
    small: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-xl",
      zClass: "text-2xl",
    },
    medium: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-3xl",
      zClass: "text-4xl",
    },
    large: {
      note: "NOTE",
      z: "Z",
      noteClass: "text-4xl",
      zClass: "text-5xl",
    },
  };

  const { note, z, noteClass, zClass } = variants[size];

  return (
    <span
      className={`flex font-semibold font-logo justify-center items-baseline select-none`}
    >
      <h2
        className={`${noteClass} ${
          invert ? "text-white" : "text-foreground"
        }  text-shadow-lg`}
      >
        {note}
      </h2>
      <h2 className={`${zClass} text-yellow-600 text-shadow-xs `}>{z}</h2>
    </span>
  );
}
