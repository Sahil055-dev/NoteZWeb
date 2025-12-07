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
import { AnimatePresence, motion } from "framer-motion";
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
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const handleSelect = (val: string) => {
    if (val === "Other") {
      setIsOther(true);
      setOtherValue("");
    } else {
      setIsOther(false);
      setOtherValue("");
      onChange?.(val); // send normal option directly
    }
  };

  const handleOtherInput = (val: string) => {
    setOtherValue(val);
    onChange?.(val); // ✅ send user input to parent
  };

  return (
    <Field className={`${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
      <FieldLabel className="text-sm md:text-base">{label}</FieldLabel>

      <Select
        onValueChange={handleSelect}
        disabled={disabled}
        value={isOther ? "Other" : value}
      >
        <SelectTrigger className={`${width} ${disabled ? "bg-muted" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.trim()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      

      {isOther && (
        <AnimatePresence>
          <motion.input
            key="otherDegree"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            type="text"
            placeholder={`Enter other ${label.toLowerCase()}`}
            value={otherValue}
            onChange={(e) => handleOtherInput(e.target.value)}
            className="mt-2 w-full rounded-md border p-2 bg-background text-foreground"
          />
        </AnimatePresence>
      )}
    </Field>
  );
}
