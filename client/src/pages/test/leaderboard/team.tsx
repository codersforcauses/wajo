import React, { useEffect, useState } from "react";

import { WaitingLoader } from "@/components/ui/loading";
import { TeamDataGrid } from "@/components/ui/Test/team-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { TeamLeaderboard } from "@/types/leaderboard";

export default function Index() {
  const {
    data: rankings,
    isLoading: isRankingLoading,
    isError: isRankingError,
    error: rankingError,
  } = useFetchData<TeamLeaderboard[]>({
    queryKey: ["leaderboard.team"],
    endpoint: "/leaderboard/team/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<TeamLeaderboard[]>([]);

  useEffect(() => {
    if (rankings) {
      setFilteredData(rankings);
    }
  }, [rankings]);

  if (isRankingLoading) return <WaitingLoader />;
  if (isRankingError) return <div>Error: {rankingError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <TeamDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
}
