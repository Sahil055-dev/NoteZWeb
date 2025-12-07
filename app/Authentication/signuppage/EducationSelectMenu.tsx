"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuProps {
  label: string;
  options: string[];
  placeholder?: string;
  width?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export default function SelectMenuField({
  label,
  options = [],
  placeholder = "Select option",
  width = "w-[180px]",
  onChange,
  value = "",
  disabled = false,
}: MenuProps) {
  const handleSelect = (val: string) => {
    onChange?.(val);
  };

  return (
    <Field className={`${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
      <FieldLabel className="text-sm md:text-base">{label}</FieldLabel>

      <Select onValueChange={handleSelect} disabled={disabled} value={value}>
        <SelectTrigger className={`${width} ${disabled ? "bg-muted" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="max-h-56 overflow-y-auto">
          {options.map((option) => (
            <SelectItem key={option} value={option.trim()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
