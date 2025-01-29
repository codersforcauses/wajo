import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { School } from "@/types/school";

type Props = {
  selectedId: number | undefined;
  onChange: (id: number) => void;
  className?: string;
};

/**
 * A form field for selecting a school from a dropdown list fetched from an API.
 *
 * @param {Object} props - The props for the component.
 * @param {number | undefined} props.selectedId - The currently selected school ID.
 * @param {Function} props.onChange - A callback function that handles the change in school ID.
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
export function SelectSchool({ selectedId, onChange, className }: Props) {
  const {
    data: schools,
    isPending,
    isError,
  } = useFetchData<School[]>({
    queryKey: ["users.school.list"],
    endpoint: "/users/schools/",
  });

  const onValueChange = (value: string) => {
    const parsed = parseInt(value);
    if (parsed) {
      onChange(parsed);
    }
    console.log("changed value: ", value);
    console.log("changed int value: ", parsed);
  };

  return (
    <Select
      value={selectedId ? selectedId.toString() : ""}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="School" />
      </SelectTrigger>
      <SelectContent>
        {isPending || isError ? (
          <SelectItem value="NaN" disabled>
            Loading...
          </SelectItem>
        ) : (
          schools.map((school) => (
            <SelectItem value={school.id.toString()} key={school.id}>
              {school.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
