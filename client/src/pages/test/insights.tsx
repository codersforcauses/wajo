import { useRouter } from "next/router";
import React from "react";

import { ProtectedPage } from "@/components/layout";
import { InsightDataGrid } from "@/components/ui/Test/insight-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Insight } from "@/types/leaderboard";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Index />
    </ProtectedPage>
  );
}

function Index() {
  const { query, isReady, push } = useRouter();

  const {
    data: insights,
    isLoading,
    isError: isInsightError,
    error: insightError,
  } = useFetchData<Insight[]>({
    queryKey: ["students.insight"],
    endpoint: "/leaderboard/insight/",
  });

  if (isInsightError) return <div>Error: {insightError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <InsightDataGrid
        datacontext={insights || []}
        isLoading={!isReady || isLoading}
      />
    </div>
  );
}
