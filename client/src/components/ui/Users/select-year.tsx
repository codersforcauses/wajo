import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: number | undefined;
  onChange: (id: number) => void;
  className?: string;
};

/**
 * A form field for selecting a year from a dropdown list.
 *
 * @param {Object} props - The props for the component.
 * @param {number | undefined} props.selectedId - The currently selected year ID.
 * @param {Function} props.onChange - A callback function that handles the change in year ID.
 * @param {string} [props.className] - An optional className to customize the component's styling.
 *
 * @example
 * <FormField
 *   control={formControl}
 *   name="school_id"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormControl>
 *         <SelectSchool
 *           selectedId={field.value}
 *           onChange={field.onChange}
 *           className="w-full"
 *         />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 */
export default function SelectYearLevel({
  selectedId,
  onChange,
  className,
}: Props) {
  const years = [
    { id: 1, name: "7" },
    { id: 2, name: "8" },
    { id: 3, name: "9" },
  ];
  const onValueChange = (value: string) => {
    const parsed = parseInt(value);
    if (parsed) {
      onChange(parsed);
    }
  };

  return (
    <Select
      value={selectedId ? selectedId.toString() : ""}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem value={year.id.toString()} key={year.id}>
            {year.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
