"use client";

import { Clock } from "lucide-react";
import * as React from "react";

import { Label } from "@/components/ui/label";

import { TimePickerInput } from "./time-picker-input";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

/**
 * A Time Picker Demo component that allows users to select hours, minutes, and seconds.
 *
 * This component is part of the date-time picker functionality and provides precise control
 * over time selection. It consists of individual time inputs for hours, minutes, and seconds,
 * each with keyboard navigation support.
 *
 * @param {Object} props - The properties object.
 * @param {Date | undefined} props.date - The currently selected date and time.
 * @param {function} props.setDate - A function to update the selected date and time.
 *
 * Additional Reference:
 * - [Github](https://github.com/openstatusHQ/time-picker)
 * - [Example](https://time.openstatus.dev/)
 * - [Documentation](https://shadcnui-expansions.typeart.cc/docs/datetime-picker)
 *
 * @example
 *   const [date, setDate] = useState<Date | undefined>(new Date());
 *   return <TimePickerDemo date={date} setDate={setDate} />;
 */
export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}
