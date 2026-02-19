"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { studentEducationOptions } from "@/app/data/eduOptions";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/app/API/supabase";
import { compressPdf } from "@/app/utilities/compressPDF";
import { Spinner } from "@/components/ui/spinner";

type dataState = {
  file: File;
  title: string;
  topic: string;
  description: string;
  subject: string;
};

interface UploadNoteDialogProps {
  onUploadSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadNoteDialog({
  onUploadSuccess,
}: UploadNoteDialogProps) {
  // const user = useAuth();

  const [open, setOpen] = useState(false);
  // Add specific state for the current action
  const [status, setStatus] = useState<
    "idle" | "compressing" | "uploading" | "saving"
  >("idle");

  const [data, setData] = useState<dataState>({
    file: undefined as unknown as File,
    title: "",
    topic: "",
    description: "",
    subject: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Add this filtering logic (before the return statement)

  // Flatten subject options
  const subjectOptions = useMemo(() => {
    const types = studentEducationOptions.educationType ?? {};
    const all: string[] = [];
    Object.values(types).forEach((group: any) => {
      if (Array.isArray(group.subjectTags)) {
        group.subjectTags.forEach((s: string) => {
          if (!all.includes(s)) all.push(s);
        });
      }
    });
    return all;
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return subjectOptions;
    return subjectOptions.filter((s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [subjectOptions, searchTerm]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      toast.info("Only PDF files are allowed");
      return;
    }

    if (f.size > MAX_FILE_SIZE) {
      toast.info("File exceeds 5MB size limit.");
      return;
    }

    setData((prev) => ({ ...prev, file: f }));
  };

  const isTitleValid =
    data.title.trim().length > 0 && data.title.trim().length <= 50;
  const isDescValid = data.description.length <= 200;

  // Validation check
  const isFormValid =
    !!data.file && isTitleValid && !!data.subject && isDescValid && !submitting;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;

    try {
      if (!data.file) throw new Error("No file selected");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to upload");

      // --- PHASE 1: COMPRESSION ---
      setStatus("compressing"); // Update UI to show "Compressing..."

      // Wait for the compression promise to fulfill
      const fileToUpload = await compressPdf(data.file);

      console.log(
        `Original: ${data.file.size}, Compressed: ${fileToUpload.size}`,
      );

      // --- PHASE 2: UPLOAD ---
      setStatus("uploading");

      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("note_bucket")
        .upload(filePath, fileToUpload); // Upload the COMPRESSED file

      if (uploadError) throw uploadError;

      // --- PHASE 3: DATABASE SAVE ---
      setStatus("saving");

      const {
        data: { publicUrl },
      } = supabase.storage.from("note_bucket").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("notes").insert({
        title: data.title,
        topic: data.topic,
        description: data.description,
        subject: data.subject,
        file_url: publicUrl,
        file_path: filePath,
        user_id: user.id,
      });

      if (dbError) throw dbError;

      // --- FINISH ---
      toast.success("File uploaded successfully!");
      setOpen(false);
      setData({
        file: undefined as unknown as File,
        title: "",
        topic: "",
        description: "",
        subject: "",
      });

      // 3. TRIGGER THE PARENT REFRESH
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-base shadow-lg shadow-primary/20">
          <UploadCloud className="mr-2 h-5 w-5" />
          Upload Note
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto flex flex-col"
        showCloseButton={status !== "idle" ? false : true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">Upload Note</DialogTitle>
          <DialogDescription>
            Share your knowledge. Please fill in all details accurately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: File & Basic Info */}
            <div className="space-y-4">
              {/* File Input */}
              <div>
                <Label className="text-sm font-medium">Document File</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors text-center">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={onFileChange}
                    className="hidden"
                    accept=".pdf"
                  />

                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {data.file ? (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium truncate max-w-[200px]">
                        {data.file.name}
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to browse file
                          <p className="text-xs">
                            (PDF should be less than 5MB)
                          </p>
                        </span>
                      </>
                    )}
                  </label>
                  {data.file && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          file: undefined as unknown as File,
                        }))
                      }
                      className="mt-2 text-destructive h-auto p-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <Label className="text-sm font-medium">
                  Title{" "}
                  <span className="text-muted-foreground text-xs">
                    (Max 50)
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Binary Trees"
                  value={data.title}
                  maxLength={50}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Topic
                  <span className="text-muted-foreground text-xs">
                    (Max 50)
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Binary Trees"
                  value={data.topic}
                  maxLength={50}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  className="mt-1.5"
                />
              </div>

              {/* Description Input */}
              <div>
                <Label className="text-sm font-medium">
                  Description{" "}
                  <span className="text-muted-foreground text-xs">
                    (Max 200)
                  </span>
                </Label>
                <Textarea
                  placeholder="Briefly describe what this note covers..."
                  value={data.description}
                  maxLength={200}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1.5 resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {data.description.length}/200
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Subject Selection */}
            <div className="flex flex-col h-full">
              <Label className="text-sm font-medium mb-2">
                Subject Category
              </Label>

              {/* Search Input */}
              <div className="mb-2 relative">
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* FIX: 
                  1. Removed 'md:max-h-full' and 'flex-1'.
                  2. Added fixed height 'h-[300px] md:h-[400px]'. 
                     This forces the scrollbar to appear when content exceeds this height.
              */}
              <div className="border rounded-md p-3 bg-muted/10 overflow-y-auto h-[330px] custom-scrollbar">
                {filteredSubjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p className="text-sm">No matches found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-1 content-start">
                    {filteredSubjects.map((s) => {
                      const isSelected = data.subject === s;
                      return (
                        <div
                          key={s}
                          onClick={() =>
                            setData((prev) => ({ ...prev, subject: s }))
                          }
                          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground font-medium shadow-sm"
                              : "hover:bg-background hover:shadow-sm text-muted-foreground"
                          }`}
                        >
                          <span>{s}</span>
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={status !== "idle" || !isFormValid}
              className="bg-primary text-primary-foreground min-w-[140px]"
            >
              {status === "compressing" && (
                <span className="flex items-center justify-center ">
                  <Spinner className="size-6 mr-2 text-foreground"></Spinner>
                  Compressing PDF
                </span>
              )}
              {status === "uploading" && (
                <span className="flex items-center justify-center ">
                  <Spinner className="size-6 mr-2 text-foreground"></Spinner>
                  Uploading
                </span>
              )}
              {status === "saving" && (
                <span className="flex items-center justify-center">
                  <Spinner className="size-6"></Spinner>
                  Saving...
                </span>
              )}
              {status === "idle" && (
                <span className="flex items-center justify-center">
                  <UploadCloud className="mr-2 size-5" />
                  Upload Note
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
