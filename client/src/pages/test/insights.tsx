import React, { useEffect, useState } from "react";

import { WaitingLoader } from "@/components/ui/loading";
import { InsightDataGrid } from "@/components/ui/Test/insight-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Insight } from "@/types/leaderboard";

export default function Index() {
  const {
    data: insights,
    isLoading: isInsightLoading,
    isError: isInsightError,
    error: insightError,
  } = useFetchData<Insight[]>({
    queryKey: ["students.insight"],
    endpoint: "/leaderboard/insight/",
  });

  if (isInsightLoading) return <WaitingLoader />;
  if (isInsightError) return <div>Error: {insightError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <InsightDataGrid datacontext={insights || []} />
    </div>
  );
}
