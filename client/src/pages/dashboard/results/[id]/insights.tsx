import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { ProtectedPage, ResultsLayout, useQuizId } from "@/components/layout";
import { Button } from "@/components/ui/button";
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
      <ResultsLayout>
        <InsightPage />
      </ResultsLayout>
    </ProtectedPage>
  );
}

function InsightPage() {
  const router = useRouter();
  const { query, isReady, push } = router;
  const quizId = useQuizId();

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } = useFetchDataTable<Insight>({
    queryKey: [`results.team.${quizId}`],
    endpoint: `/results/team/?quizId=${quizId}`,
    searchParams: searchParams,
  });

  const {
    data: insights,
    isLoading: isInsightLoading,
    isError: isInsightError,
    error: insightError,
  } = useFetchData<Insight[]>({
    queryKey: [`students.insight.${quizId}`],
    endpoint: `/results/insight/?quiz_id=${quizId}`,
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
    push(
      { query: toQueryString(updatedParams) },
      `/dashboard/results/${quizId}/insights`,
      { shallow: true },
    );
  };

  if (error) return <div>Error: {error.message}</div>;

  // For CSV export
  type ResultsRecord = [
    {
      category: "All Students";
      total: Number;
      public_count: Number;
      catholic_count: Number;
      independent_count: Number;
      allies_count: Number;
      country: Number;
      year_7: Number;
      year_8: Number;
      year_9: Number;
    },
    {
      category: "Students with scores";
      total: Number;
      public_count: Number;
      catholic_count: Number;
      independent_count: Number;
      allies_count: Number;
      country: Number;
      year_7: Number;
      year_8: Number;
      year_9: Number;
    },
    {
      category: "All Teams";
      total: Number;
      public_count: Number;
      catholic_count: Number;
      independent_count: Number;
      allies_count: Number;
      country: Number;
      year_7: Number;
      year_8: Number;
      year_9: Number;
    },
    {
      category: "Teams with scores";
      total: Number;
      public_count: Number;
      catholic_count: Number;
      independent_count: Number;
      allies_count: Number;
      country: Number;
      year_7: Number;
      year_8: Number;
      year_9: Number;
    },
  ];

  /**
   * Download a CSV file from the db data.
   * The CSV will contain the following columns:
   *   Category (All Students, Students with scores, All Teams, Teams with scores),
   *   Total, Public, Catholic, Independent, Allies, Country, Year 7, Year 8, Year 9
   */
  const downloadInsightsCSV = () => {
    // instead of getting from localStorage, use the data fetched from the API
    const csvData: ResultsRecord = [
      {
        category: "All Students",
        total: data?.[0]?.total ?? 0,
        public_count: data?.[0]?.public_count ?? 0,
        catholic_count: data?.[0]?.catholic_count ?? 0,
        independent_count: data?.[0]?.independent_count ?? 0,
        allies_count: data?.[0]?.allies_count ?? 0,
        country: data?.[0]?.country ?? 0,
        year_7: data?.[0]?.year_7 ?? 0,
        year_8: data?.[0]?.year_8 ?? 0,
        year_9: data?.[0]?.year_9 ?? 0,
      },
      {
        category: "Students with scores",
        total: data?.[1]?.total ?? 0,
        public_count: data?.[1]?.public_count ?? 0,
        catholic_count: data?.[1]?.catholic_count ?? 0,
        independent_count: data?.[1]?.independent_count ?? 0,
        allies_count: data?.[1]?.allies_count ?? 0,
        country: data?.[1]?.country ?? 0,
        year_7: data?.[1]?.year_7 ?? 0,
        year_8: data?.[1]?.year_8 ?? 0,
        year_9: data?.[1]?.year_9 ?? 0,
      },
      {
        category: "All Teams",
        total: data?.[2]?.total ?? 0,
        public_count: data?.[2]?.public_count ?? 0,
        catholic_count: data?.[2]?.catholic_count ?? 0,
        independent_count: data?.[2]?.independent_count ?? 0,
        allies_count: data?.[2]?.allies_count ?? 0,
        country: data?.[2]?.country ?? 0,
        year_7: data?.[2]?.year_7 ?? 0,
        year_8: data?.[2]?.year_8 ?? 0,
        year_9: data?.[2]?.year_9 ?? 0,
      },
      {
        category: "Teams with scores",
        total: data?.[3]?.total ?? 0,
        public_count: data?.[3]?.public_count ?? 0,
        catholic_count: data?.[3]?.catholic_count ?? 0,
        independent_count: data?.[3]?.independent_count ?? 0,
        allies_count: data?.[3]?.allies_count ?? 0,
        country: data?.[3]?.country ?? 0,
        year_7: data?.[3]?.year_7 ?? 0,
        year_8: data?.[3]?.year_8 ?? 0,
        year_9: data?.[3]?.year_9 ?? 0,
      },
    ];

    if (!data || data.length === 0) {
      toast.warning("No data available to export.");
      return;
    }

    // CSV headers in the order you want them
    const csvHeaders = [
      "Category",
      "Total",
      "Public",
      "Catholic",
      "Independent",
      "Allies",
      "Country",
      "Year 7",
      "Year 8",
      "Year 9",
    ];

    // Build each row from csvData
    const allStudentsCsvRows = Object.values(csvData[0]);
    const studentsWithScoresCsvRows = Object.values(csvData[1]);
    const allTeamsCsvRows = Object.values(csvData[2]);
    const teamsWithScoresCsvRows = Object.values(csvData[3]);
    const csvRows = [
      allStudentsCsvRows,
      studentsWithScoresCsvRows,
      allTeamsCsvRows,
      teamsWithScoresCsvRows,
    ];

    // Convert to CSV string
    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    // Trigger a download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "Insights_WAJO.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="m-4 space-y-4">
      <Suspense>
        <Suspense fallback={<div className="h-6 w-6 animate-pulse" />}>
          <Button
            variant="outline"
            className="h-auto"
            onClick={downloadInsightsCSV}
          >
            Download CSV
          </Button>
        </Suspense>
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
