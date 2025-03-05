import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { Category } from "@/types/question";

type Props = {
  value?: Option[];
  onChange?: (value: Option[]) => void;
  className?: string;
};

export function MultipleSelectCategory({ value, onChange, className }: Props) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchDataTable<Category>({
    queryKey: ["questions.categories.all"],
    endpoint: "/questions/categories/",
    searchParams: {
      nrows: 999999, // to get all with some large number
      page: 1,
    },
  });

  if (isLoading || isError) return;

  const categoryOptions =
    isLoading || isError
      ? []
      : categories?.map((cat) => ({
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
      disabled={isLoading || isError}
    />
  );
}
