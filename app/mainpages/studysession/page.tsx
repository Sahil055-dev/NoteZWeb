"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/app/API/supabase"; // Your existing client
import PdfViewer from "@/app/Components/PdfViewer";
import { Spinner } from "@/components/ui/spinner";


function PdfContent() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");
  const noteId = searchParams.get("noteId");
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!filePath) return;

      // 1. Fetch the Signed URL here
      // Replace 'note_bucket' with your actual bucket name
      const { data, error } = await supabase.storage
        .from("note_bucket")
        .createSignedUrl(filePath, 3600); // Valid for 1 hour

      if (error) {
        console.error("Error generating signed URL:", error);
        setError("Could not access the file. It may have been deleted.");
      } else if (data) {
        setSignedUrl(data.signedUrl);
      }
    };

    fetchPdfUrl();
  }, [filePath]);

  // 2. Handle Loading and Error States
  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-muted-foreground">
        <Spinner className="mr-2" /> Loading document...
      </div>
    );
  }

  // 3. Pass the URL to the dumb UI component
  return <PdfViewer fileUrl={signedUrl} noteId={noteId || undefined} />;
}

export default function PdfPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Suspense is required when using useSearchParams in Client Components */}
      <Suspense
        fallback={
          <div className="flex justify-center mt-20">
            <Spinner />
          </div>
        }
      >
        <PdfContent />
      </Suspense>
    </main>
  );
}
