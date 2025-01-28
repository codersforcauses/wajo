import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { LeaderboardDataGrid } from "@/components/ui/Test/leaderboard-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Leaderboard } from "@/types/leaderboard";

export default function Index() {
  const {
    data: leaderboards,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
    error: leaderboardError,
  } = useFetchData<Leaderboard[]>({
    queryKey: ["leaderboard.individual"],
    endpoint: "/leaderboard/individual/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Leaderboard[]>([]);

  useEffect(() => {
    if (leaderboards) {
      setFilteredData(leaderboards);
    }
  }, [leaderboards]);

  const handleFilterChange = (value: string) => {
    if (!leaderboards) return;

    const filtered =
      value.trim() === ""
        ? leaderboards
        : leaderboards.filter((item) => {
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

  if (isLeaderboardLoading) return <WaitingLoader />;
  if (isLeaderboardError) return <div>Error: {leaderboardError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search Leaderboard"
          onSearch={handleFilterChange}
        />
      </div>

      <LeaderboardDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}
