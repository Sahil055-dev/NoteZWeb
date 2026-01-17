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
import { useAuth } from "@/components/context/AuthProvider";

type dataState = {
  file: File;
  title: string;
  topic: string;
  description: string;
  subject: string;
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadNoteDialog() {
  // const user = useAuth();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<dataState>({
    file: undefined as unknown as File,
    title: "",
    topic: "",
    description: "",
    subject: "",
  });

  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    try {
      const fileName = `${Date.now()}.${data.file?.name.split(".").pop()}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("note_bucket") // Make sure this matches your bucket name exactly
        .upload(filePath, data.file);

      if (uploadError) throw uploadError;

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
        user_id: user?.id,
      });

      if (dbError) throw dbError;

      // Success!
      toast.success("Note uploaded successfully!");
      setOpen(false);
      
      // Reset Form
      setData({
        file: undefined as unknown as File,
        title: "",
        topic: "",
        description: "",
        subject: "",
      });

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong during upload");
    } finally {
      setSubmitting(false);
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

      <DialogContent className="sm:max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto flex flex-col">
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
                        setData((prev) => ({ ...prev, file: null }))
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

            {/* Right Column: Subject Selection (Single Select) */}
            <div className="flex flex-col h-full">
              <Label className="text-sm font-medium mb-2">
                Subject Category
              </Label>
              <div className="flex-1 border rounded-md p-3 bg-muted/10 overflow-y-auto max-h-[300px] md:max-h-full">
                {subjectOptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No subjects found.
                  </p>
                ) : (
                  <div className="h-[40vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-1">
                    {subjectOptions.map((s) => {
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
                          {s}
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

          <DialogFooter className="pt-2 sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-primary text-primary-foreground min-w-[120px]"
            >
              {submitting ? "Uploading..." : "Upload Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
