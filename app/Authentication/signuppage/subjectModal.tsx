"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { on } from "events";

type Props = {
  options?: string[]; // subject options to show
  initialSelected?: string[]; // optional initial values
  onSubmit?: (val: string[]) => void; // optional callback when form submitted
  label?: string;
};

export default function DialogMultiSelect({
  options = [],
  initialSelected = [],
  onSubmit,
  label,
}: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // filtered list for display
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (val: string) =>
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const remove = (val: string) =>
    setSelected((prev) => prev.filter((v) => v !== val));

  const handleSubmit = (values: string[]) => {
    onSubmit?.(values);
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 border-primary/60"
          type="button"
        >
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] w-full">
        <DialogHeader>
          <DialogTitle>Select Subjects</DialogTitle>
          <DialogDescription>
            Search and add the subjects you are interested in. Selected subjects
            will appear below.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="mt-4">
          <Label className="text-sm">Search Subjects</Label>
          <Input
            placeholder="Type to filter subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-2"
            aria-label="Search subjects"
          />
        </div>

        {/* Results list + selected chips */}
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-secondary mr-2 self-center">
              Selected:
            </span>

            <AnimatePresence initial={false}>
              {selected.length === 0 ? (
                <motion.span
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Click on the subjects to select 
                </motion.span>
              ) : null}

              {selected.map((s) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="button"
                  onClick={() => remove(s)}
                  title={`Remove ${s}`}
                  className="flex items-center gap-2 rounded-full px-3 py-1 bg-card/80 border border-muted text-sm text-foreground shadow-sm"
                >
                  <span className="truncate max-w-[12rem]">{s}</span>
                  <span className="text-xs text-muted-foreground">✕</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-1">
            <Label className="text-sm">Available Subjects</Label>

            <div className="mt-2 max-h-56 overflow-auto rounded-md border bg-background p-2">
              {filtered.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  No subjects match “{query}”
                </div>
              ) : (
                <ul className="space-y-1">
                  {filtered.map((opt) => {
                    const isSelected = selected.includes(opt);
                    return (
                      <li
                        key={opt}
                        // highlight selected row using app theme — left accent + background tint + bold label
                        className={`flex items-center justify-between rounded px-2 py-2 cursor-pointer focus:outline-none ${
                          isSelected
                            ? "bg-primary/10 border-l-4 border-primary text-foreground font-semibold"
                            : "hover:bg-muted/40 text-foreground"
                        }`}
                        onClick={() => toggle(opt)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(opt);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* left spacer where checkbox used to be — keeps alignment */}
                          <div className="w-5" aria-hidden />
                          <span className="text-sm truncate">{opt}</span>
                        </div>

                        {/* Selected hint on the right */}
                        {isSelected ? (
                          <span className="text-xs text-muted-foreground">
                            Selected
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Hidden input for form submit */}
        <input
          type="hidden"
          name="subjects"
          value={selected.join(",")}
          readOnly
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => handleSubmit(selected)}>
              Add Subjects ({selected.length})
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
