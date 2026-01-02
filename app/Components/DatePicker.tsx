"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format, subYears } from "date-fns"; // Import subYears for easy calculation

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function DatePicker({
  onSelectDate,
}: {
  onSelectDate?: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>();

  // 1. Calculate the maximum allowed date (Today - 15 years)
  // e.g., If today is Dec 2025, maxDate will be Dec 2010.
  const maxDate = subYears(new Date(), 15);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10">
          <Button
            variant="outline"
            id="date"
            // w-full usually looks better in forms than w-1/2, but kept w-full here for safety
            className={`w-full justify-between font-normal ${!date && "text-muted-foreground"}`}
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
              // Prevent unselecting if user clicks the same date again
              if (!selectedDate) return;
              setDate(selectedDate);
              setOpen(false);
              onSelectDate?.(selectedDate);
            }}
            captionLayout="dropdown"
            
            // 2. Logic to disable dates
            disabled={(date) =>
              date > maxDate || date < new Date("1900-01-01")
            }
            
            // 3. Set the navigation limits
            startMonth={new Date(1940, 0)} 
            endMonth={maxDate} // Dropdown will stop at 2010 (or 15 years ago)
            
            defaultMonth={maxDate} // Opens calendar at the max allowed date
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}