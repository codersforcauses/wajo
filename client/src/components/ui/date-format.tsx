import { format } from "date-fns";

import { cn } from "@/lib/utils"; // Import cn utility

interface DateTimeDisplayProps {
  date: string | Date;
  className?: string;
}

export default function DateTimeDisplay({
  date,
  className,
}: DateTimeDisplayProps) {
  if (!date) return "NA";
  // ref: https://date-fns-interactive.netlify.app/
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-nowrap">{format(new Date(date), "PP")}</div>
      <div className="text-nowrap">{format(new Date(date), "pp")}</div>
    </div>
  );
}
