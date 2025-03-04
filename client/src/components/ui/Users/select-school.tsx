import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { School, SchoolTypeEnum } from "@/types/user";

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
  const { data, isLoading, error, totalPages } = useFetchDataTable<School>({
    queryKey: ["users.schools"],
    endpoint: "/users/schools/",
    searchParams: {
      nrows: 999999, // to get all with some large number
      page: 1,
    },
  });

  // Auto Select when only 1 data
  useEffect(() => {
    if (data?.length === 1 && !selectedId) {
      onChange(data[0].id);
    }
  }, [data, selectedId, onChange]);

  const onValueChange = (value: string) => {
    const parsed = parseInt(value);
    if (parsed) {
      onChange(parsed);
    }
  };

  const value = selectedId ? selectedId.toString() : "";
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="School" />
      </SelectTrigger>
      <SelectContent>
        {isLoading || error ? (
          <SelectItem value="NaN" disabled>
            {isLoading ? "Loading..." : "Error"}
          </SelectItem>
        ) : !data || !data.length ? (
          <SelectItem value="NaN" disabled>
            No Data Found
          </SelectItem>
        ) : (
          data.map((school) => (
            <SelectItem value={school.id.toString()} key={school.id}>
              {school.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

type SchoolTypeProps = {
  selectedType: string | undefined;
  onChange: (role: string) => void;
  className?: string;
};

export function SelectSchoolType({
  selectedType,
  onChange,
  className,
}: SchoolTypeProps) {
  const onValueChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select
      value={selectedType ? selectedType.toString() : ""}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {SchoolTypeEnum.options.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
