import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { SchoolDataGrid } from "@/components/ui/Users/school-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { School } from "@/types/school";

export default function SchoolList() {
  const {
    data: schools,
    isLoading: isSchoolLoading,
    isError: isSchoolError,
    error: schoolError,
  } = useFetchData<School[]>({
    queryKey: ["users.school.list"],
    endpoint: "/users/schools/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<School[]>([]);

  useEffect(() => {
    if (schools) {
      setFilteredData(schools);
    }
  }, [schools]);

  const handleFilterChange = (value: string) => {
    if (!schools) return;

    const filtered =
      value.trim() === ""
        ? schools
        : schools.filter((item) => {
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

  if (isSchoolLoading) return <WaitingLoader />;
  if (isSchoolError) return <div>Error: {schoolError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search School"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"/users/create_school"}>Create a School</Link>
        </Button>
      </div>

      <SchoolDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></SchoolDataGrid>
    </div>
  );
}
