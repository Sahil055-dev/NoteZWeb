import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/app/Components/ThemeToggler";

export default function Header() {
  return (
    <header
      className="
        fixed top-4 left-1/2 -translate-x-1/2 
        w-[60%] border border-border rounded-2xl 
        bg-background/70 backdrop-blur-md  
        z-50 inset-ring-2 inset-ring-amber-100
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Logo size="small" />
        <div className="flex gap-6">
          <Button
            variant={"ghost"}
            className="  text-foreground border-primary text-md rounded-md hover:bg-primary hover:text-black transition"
          >
            Sign In
          </Button>
          <Button className="bg-primary hover:bg-primary-hover text-foreground  text-md">
            Sign Up
          </Button>
          <ThemeToggle></ThemeToggle>
        </div>
      </div>
    </header>
  );
}
