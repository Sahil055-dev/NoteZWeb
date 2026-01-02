import Logo from "./Components/Logo";


export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo / App name */}
        <div className="font-logo text-3xl tracking-wide">
          <Logo></Logo>
        </div>

        {/* Spinner */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>

        {/* Skeleton hint */}
        <div className="mt-2 flex flex-col gap-2">
         Kindly wait while we are loading your dashboard :-)
        </div>
      </div>
    </div>
  );
}
