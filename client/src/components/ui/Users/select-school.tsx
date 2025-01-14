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

export function SelectSchool({ selectedId, onChange, className }: Props) {
  const {
    data: schools,
    isPending,
    isError,
  } = useFetchData<School[]>({
    queryKey: ["users.school.list"],
    endpoint: "/users/school",
  });

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
