import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";

import { ProtectedPage } from "@/components/layout";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
  toQueryString,
} from "@/components/ui/pagination";
import { InsightDataGrid } from "@/components/ui/Test/insight-data-grid";
import { useFetchData, useFetchDataTable } from "@/hooks/use-fetch-data";
import { Insight } from "@/types/leaderboard";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <InsightPage />
    </ProtectedPage>
  );
}

function InsightPage() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } = useFetchDataTable<Insight>({
    queryKey: ["results.team"],
    endpoint: "/results/team/",
    searchParams: searchParams,
  });

  const {
    data: insights,
    isLoading: isInsightLoading,
    isError: isInsightError,
    error: insightError,
  } = useFetchData<Insight[]>({
    queryKey: ["students.insight"],
    endpoint: "/results/insight/",
  });

  useEffect(() => {
    if (!isLoading) {
      setSearchParams((prev) => ({
        search: (query.search as string) || prev.search,
        nrows: Number(query.nrows) || prev.nrows,
        page: Number(query.page) || prev.page,
      }));
    }
  }, [query.search, query.nrows, query.page, !isLoading]);

  const setAndPush = (newParams: Partial<PaginationSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    push({ query: toQueryString(updatedParams) }, undefined, { shallow: true });
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <Suspense>
        <div>
          <InsightDataGrid
            datacontext={insights ?? []}
            isLoading={!isReady || isInsightLoading}
          />
          <div className="flex items-center justify-between p-4">
            {/* Rows Per Page Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <SelectRow
                className="h-7 w-20"
                selectedRow={searchParams.nrows}
                onChange={(newNrows) =>
                  setAndPush({ nrows: Number(newNrows), page: 1 })
                }
              />
            </div>
            {/* Pagination Controls */}
            <Pagination
              totalPages={totalPages}
              currentPage={searchParams.page}
              onPageChange={(newPage: number) =>
                setAndPush({ page: Math.min(newPage, totalPages) })
              }
              className="mr-4 flex"
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
