import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { CategoryResponse } from "@/types/question";

type Props = {
  value?: Option[];
  onChange?: (value: Option[]) => void;
  className?: string;
};

export function MultipleSelectCategory({ value, onChange, className }: Props) {
  const {
    data: categories,
    isPending,
    isError,
  } = useFetchData<CategoryResponse>({
    queryKey: ["questions.categories"],
    endpoint: "/questions/categories/",
  });

  if (isPending || isError) return;

  const categoryOptions =
    isPending || isError
      ? []
      : categories.results?.map((cat) => ({
          label: cat.genre,
          value: cat.id.toString(),
        }));

  return (
    <MultipleSelector
      className={cn(className)}
      value={value}
      onChange={onChange}
      defaultOptions={categoryOptions}
      placeholder="Select categories..."
      emptyIndicator="No categories found."
      disabled={isPending || isError}
    />
  );
}
