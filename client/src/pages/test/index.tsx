import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { PracticeDataGrid } from "@/components/ui/Test/practice-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Practice } from "@/types/practice";

export default function Index() {
  const {
    data: practices,
    isLoading: isPracticeLoading,
    isError: isPracticeError,
    error: practiceError,
  } = useFetchData<Practice[]>({
    queryKey: ["practice.list"],
    endpoint: "/test/practices",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Practice[]>([]);

  useEffect(() => {
    if (practices) {
      setFilteredData(practices);
    }
  }, [practices]);

  const handleFilterChange = (value: string) => {
    if (!practices) return;

    const filtered =
      value.trim() === ""
        ? practices
        : practices.filter((item) => {
            const query = value.toLowerCase().trim();
            const isExactMatch = query.startsWith('"') && query.endsWith('"');
            const normalizedQuery = isExactMatch ? query.slice(1, -1) : query;

            return isExactMatch
              ? item.name.toLowerCase() === normalizedQuery
              : item.name.toLowerCase().includes(normalizedQuery);
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isPracticeLoading) return <WaitingLoader />;
  if (isPracticeError) return <div>Error: {practiceError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search Practice"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"test/create"}>Create a Practice</Link>
        </Button>
      </div>

      <PracticeDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}
