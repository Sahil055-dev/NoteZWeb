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
import { studentEducationOptions } from "@/app/data/eduOptions"; // Adjust path if needed
import { UploadCloud } from "lucide-react";

export default function UploadNoteDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Changed to single string instead of array
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const isNameValid = name.trim().length > 0 && name.trim().length <= 16;
  const isDescValid = description.length <= 200;

  // Validation check
  const isFormValid =
    !!file && isNameValid && !!selectedSubject && isDescValid && !submitting;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("file", file as Blob);
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("subject", selectedSubject || "");

      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        setOpen(false);
        resetForm();
        console.log("Uploaded:", { name, file, selectedSubject, description });
      }, 800);
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFile(null);
    setName("");
    setDescription("");
    setSelectedSubject(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 px-8 py-6 text-base shadow-lg shadow-primary/20">
          <UploadCloud className="mr-2 h-5 w-5" />
          Upload Note
        </Button>
      </DialogTrigger>

      {/* sm:max-w-3xl -> Wider on tablet/desktop
         max-h-[90vh] -> Prevents cutting off on small vertical screens
         overflow-y-auto -> Internal scrolling
      */}
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
                    accept=".pdf,.png,.jpg,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {file ? (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to browse file
                        </span>
                      </>
                    )}
                  </label>
                  {file && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setFile(null)}
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
                    (Max 30)
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Binary Trees"
                  value={name}
                  maxLength={30}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Topic
                  <span className="text-muted-foreground text-xs">
                    (Max 24)
                  </span>
                </Label>
                <Input
                  placeholder="e.g. Binary Trees"
                  value={topic}
                  maxLength={24}
                  onChange={(e) => setTopic(e.target.value)}
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
                  value={description}
                  maxLength={200}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {description.length}/200
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
                      const isSelected = selectedSubject === s;
                      return (
                        <div
                          key={s}
                          onClick={() => setSelectedSubject(s)}
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
