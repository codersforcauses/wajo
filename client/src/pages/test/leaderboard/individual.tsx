import React, { useEffect, useState } from "react";

import { WaitingLoader } from "@/components/ui/loading";
import { IndividualDataGrid } from "@/components/ui/Test/individual-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { IndividualLeaderboard } from "@/types/leaderboard";

export default function Index() {
  const {
    data: rankings,
    isLoading: isRankingLoading,
    isError: isRankingError,
    error: rankingError,
  } = useFetchData<IndividualLeaderboard[]>({
    queryKey: ["leaderboard.individual"],
    endpoint: "/leaderboard/individual/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<IndividualLeaderboard[]>([]);

  useEffect(() => {
    if (rankings) {
      setFilteredData(rankings);
    }
  }, [rankings]);

  if (isRankingLoading) return <WaitingLoader />;
  if (isRankingError) return <div>Error: {rankingError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <IndividualDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}