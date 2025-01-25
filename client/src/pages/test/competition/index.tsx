import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { CompetitionDataGrid } from "@/components/ui/Test/competition-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Competition } from "@/types/competition";

export default function Index() {
  const {
    data: competitions,
    isLoading: isCompetitionLoading,
    isError: isCompetitionError,
    error: competitionError,
  } = useFetchData<Competition[]>({
    queryKey: ["competition.list"],
    endpoint: "/test/competitions",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Competition[]>([]);

  useEffect(() => {
    if (competitions) {
      setFilteredData(competitions);
    }
  }, [competitions]);

  const handleFilterChange = (value: string) => {
    if (!competitions) return;

    const filtered =
      value.trim() === ""
        ? competitions
        : competitions.filter((item) => {
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

  if (isCompetitionLoading) return <WaitingLoader />;
  if (isCompetitionError) return <div>Error: {competitionError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search Competition"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"competition/create"}>Create a Competition</Link>
        </Button>
      </div>

      <CompetitionDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}
