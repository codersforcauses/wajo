"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { TimePickerDemo } from "./time-picker-demo";

/**
 * A combined Date and Time Picker component for selecting date and time values.
 *
 * This component integrates a date picker (using a calendar) and a time picker,
 * allowing users to choose a specific date and time. It uses a `Popover` for
 * displaying the calendar and time picker in an overlay.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.field - The field object passed as props, which includes the following:
 *   @param {any} props.field.value - The current value of the date and time field.
 *   @param {function} props.field.onChange - The handler to update the selected value.
 *
 * Additional Reference:
 * - [Github](https://github.com/openstatusHQ/time-picker)
 * - [Example](https://time.openstatus.dev/)
 * - [Documentation](https://shadcnui-expansions.typeart.cc/docs/datetime-picker)
 *
 * @example
 *   const { control } = useForm();
 *
 *   return (
 *     <Controller
 *       name="datetime"
 *       control={control}
 *       render={({ field }) => <DateTimePicker field={field} />}
 *     />
 *   );
 */
export function DateTimePicker({ field }: { field: any }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !field.value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? (
            format(field.value, "PPP HH:mm:ss")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          initialFocus
        />
        <div className="border-t border-border p-3">
          <TimePickerDemo setDate={field.onChange} date={field.value} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
