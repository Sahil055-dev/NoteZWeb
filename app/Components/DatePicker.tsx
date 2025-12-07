"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function DatePicker() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex flex-col gap-3">
     
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10">
          <Button
            variant="outline"
            id="date"
            className="w-1/2 justify-between font-normal"
          >
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-popover border border-border rounded-md"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(1940, 0)} endMonth={new Date(2025, 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
