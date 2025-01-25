import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  selectedTime: number;
  onChange: (time: number) => void;
  className?: string;
};

/**
 * Renders a dropdown for selecting hours (0-23).
 *
 * @param {Object} props - The component props.
 * @param {number} props.selectedHour - The currently selected hour.
 * @param {Function} props.onChange - Callback function triggered when the selected hour changes.
 * @param {string} [props.className] - Optional additional class names for the select trigger.
 */
export function SelectHour({ selectedTime, onChange, className }: Props) {
  const onValueChange = (value: string) => {
    onChange(parseInt(value, 10));
  };

  return (
    <Select value={selectedTime?.toString()} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Select Hours" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 24 }, (_, index) => (
          <SelectItem key={index} value={index.toString()}>
            {index.toString().padStart(2, "0")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Renders a dropdown for selecting minutes (0-59).
 *
 * @param {Object} props - The component props.
 * @param {number} props.selectedMinute - The currently selected minute.
 * @param {Function} props.onChange - Callback function triggered when the selected minute changes.
 * @param {string} [props.className] - Optional additional class names for the select trigger.
 */
export function SelectMinute({ selectedTime, onChange, className }: Props) {
  const onValueChange = (value: string) => {
    onChange(parseInt(value, 10));
  };

  return (
    <Select value={selectedTime?.toString()} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Select Minutes" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 60 }, (_, index) => (
          <SelectItem key={index} value={index.toString()}>
            {index.toString().padStart(2, "0")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
