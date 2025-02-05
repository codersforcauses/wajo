import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { CategoryDataGrid } from "@/components/ui/Question/category-data-grid";
import { SearchInput } from "@/components/ui/search";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Category } from "@/types/question";

export default function Index() {
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useFetchData<Category[]>({
    queryKey: ["questions.categories"],
    endpoint: "/questions/categories/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Category[]>([]);

  useEffect(() => {
    if (categories) {
      setFilteredData(categories);
    }
  }, [categories]);

  const handleFilterChange = (value: string) => {
    if (!categories) return;

    const filtered =
      value.trim() === ""
        ? categories
        : categories.filter((item) => {
            const query = value.toLowerCase().trim();
            const isExactMatch = query.startsWith('"') && query.endsWith('"');
            const normalizedQuery = isExactMatch ? query.slice(1, -1) : query;

            return isExactMatch
              ? item.genre.toLowerCase() === normalizedQuery
              : item.genre.toLowerCase().includes(normalizedQuery);
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isCategoryLoading) return <WaitingLoader />;
  if (isCategoryError) return <div>Error: {categoryError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search Genre"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"/question/category/create"}>Create a Category</Link>
        </Button>
      </div>

      <CategoryDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}
