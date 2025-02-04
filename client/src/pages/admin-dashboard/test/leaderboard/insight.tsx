import React, { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { WaitingLoader } from "@/components/ui/loading";
import { InsightDataGrid } from "@/components/ui/Test/insight-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { NextPageWithLayout } from "@/pages/_app";
import { Insight } from "@/types/leaderboard";

const InsightPage: NextPageWithLayout = () => {
  const {
    data: insights,
    isLoading: isInsightLoading,
    isError: isInsightError,
    error: insightError,
  } = useFetchData<Insight[]>({
    queryKey: ["leaderboard.individual"],
    endpoint: "/leaderboard/individual/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Insight[]>([]);

  useEffect(() => {
    if (insights) {
      setFilteredData(insights);
    }
  }, [insights]);

  if (isInsightLoading) return <WaitingLoader />;
  if (isInsightError) return <div>Error: {insightError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <InsightDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      />
    </div>
  );
};

InsightPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default InsightPage;
