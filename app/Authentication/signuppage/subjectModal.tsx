"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
import { Label } from "@/components/ui/label";

interface MenuProps {
  label: string;
  options: string[];
  placeholder?: string;
  width?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export default function SubjectDialog({
  label,
  options = [],
  placeholder = "Select option",
  width = "w-[180px]",
  onChange,
  value = "",
  disabled = false,
}: MenuProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = React.useState(false);
  const [otherSubject, setOtherSubject] = React.useState("");

  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Other",
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedSubjects(selected);
    setShowOtherInput(selected.includes("Other"));
  };

  const addOtherSubject = () => {
    if (otherSubject.trim() !== "") {
      setSelectedSubjects((prev) => [
        ...prev.filter((v) => v !== "Other"),
        otherSubject.trim(),
      ]);
      setOtherSubject("");
      setShowOtherInput(false);
    }
  };

  const removeSubject = (subj: string) => {
    setSelectedSubjects((prev) => prev.filter((v) => v !== subj));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>

      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[500px]" forceMount>
            <motion.div
              key="dialog-inner"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle>Choose Your Subject Interests</DialogTitle>
                <DialogDescription>
                  Select one or more subjects below.
                </DialogDescription>
              </DialogHeader>

              {/* ---- Multi-select menu ---- */}
              <div className="flex flex-col gap-3 mt-4">
                <Label htmlFor="subjects">Subjects</Label>
                <select
                  id="subjects"
                  multiple
                  className="rounded-md border p-2 bg-background text-foreground w-full h-32 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={selectedSubjects}
                  onChange={handleSelectChange}
                >
                  {subjectOptions.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>

                {showOtherInput && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter other subject"
                      value={otherSubject}
                      onChange={(e) => setOtherSubject(e.target.value)}
                      className="rounded-md border p-2 flex-1 bg-background text-foreground"
                    />
                    <Button type="button" onClick={addOtherSubject}>
                      Add
                    </Button>
                  </div>
                )}

                {/* ---- Display selected items as themed chips ---- */}
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSubjects.map((subj) => (
                      <div
                        key={subj}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        <span>{subj}</span>
                        <button
                          type="button"
                          onClick={() => removeSubject(subj)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  (Hold Ctrl or Cmd to select multiple subjects)
                </p>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
