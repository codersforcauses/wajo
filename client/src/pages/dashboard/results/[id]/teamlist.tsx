import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ProtectedPage,
  ResultsLayout,
  useQuizResultsContext,
} from "@/components/layout";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
  toQueryString,
} from "@/components/ui/pagination";
import { TeamListDataGrid } from "@/components/ui/Results/teamlist-data-grid";
import { SearchInput } from "@/components/ui/search";
import { useFetchData, useFetchDataTable } from "@/hooks/use-fetch-data";
import {
  OrderingItem,
  orderingToString,
  stringToOrdering,
} from "@/types/data-grid";
import { TeamLeaderboard } from "@/types/leaderboard";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <ResultsLayout>
        <TeamLeaderboardIndex />
      </ResultsLayout>
    </ProtectedPage>
  );
}

function TeamLeaderboardIndex() {
  const router = useRouter();
  const { query, isReady, push } = router;
  const { quizId, quizName } = useQuizResultsContext();

  const [orderings, setOrderings] = useState<OrderingItem>({});

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    ordering: orderingToString(orderings),
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } =
    useFetchDataTable<TeamLeaderboard>({
      queryKey: [`results.teamlist.${quizId}`],
      endpoint: `/results/teamlist/?quiz_id=${quizId}`,
      searchParams: searchParams,
    });

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  useEffect(() => {
    if (isReady && !isLoading) {
      setSearchParams((prev) => ({
        ordering: (query.ordering as string) || prev.ordering,
        search: (query.search as string) || prev.search,
        nrows: Number(query.nrows) || prev.nrows,
        page: Number(query.page) || prev.page,
      }));
      setOrderings(stringToOrdering(query.ordering as string));
    }
  }, [
    query.ordering,
    query.search,
    query.nrows,
    query.page,
    isReady,
    isLoading,
  ]);

  const setAndPush = (newParams: Partial<PaginationSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    push(
      { query: toQueryString(updatedParams) },
      `/dashboard/results/${quizId}/teams`,
      { shallow: true },
    );
  };

  const onOrderingChange = (field: keyof OrderingItem) => {
    setOrderings((prevOrderings) => {
      const newOrder = prevOrderings[field] === "asc" ? "desc" : "asc";
      const newOrderings = {
        [field]: newOrder,
      } as OrderingItem;
      setAndPush({ ordering: orderingToString(newOrderings) });
      return newOrderings;
    });
  };

  const [exportIsClicked, setExportIsClicked] = useState(false);

  const {
    data: nonPaginatedData,
    isLoading: nonPaginatedIsLoading,
    error: nonPaginatedError,
  } = useFetchData<TeamLeaderboard>({
    queryKey: [`results.team.${quizId}.non-paginated`],
    endpoint: `/results/team/non_paginated/?quiz_id=${quizId}`,
    enabled: exportIsClicked,
  });

  useEffect(() => {
    if (exportIsClicked && !nonPaginatedIsLoading && nonPaginatedData) {
      console.log(
        "Request URL:",
        `/results/teamlist/non_paginated/?quiz_id=${quizId}`,
      );
      console.log("nonPaginatedData: ", nonPaginatedData);
      downloadTeamsCSV(nonPaginatedData);
      setExportIsClicked(false); // Reset the state
    }
  }, [exportIsClicked, nonPaginatedData, nonPaginatedIsLoading]);

  useEffect(() => {
    if (data) {
      console.log("data: ", data);
    }
  });

  if (error) return <div>Error: {error.message}</div>;

  // For CSV export
  type ResultsRecord = {
    schoolName: string;
    teamId: number;
    student1: {
      name: string;
      year_level: number;
      score: number;
    };
    student2: {
      name: string;
      year_level: number;
      score: number;
    };
    student3: {
      name: string;
      year_level: number;
      score: number;
    };
    student4: {
      name: string;
      year_level: number;
      score: number;
    };
    totalMarks: number;
  };

  /**
   * Download a CSV file from the db data.
   * The CSV will contain the following columns:
   *   School Name, Team Id, Total Marks, Is Country, Max Year Level, Student 1, Student 2, Student 3
   *   Student 4
   */
  const downloadTeamsCSV = (data: TeamLeaderboard) => {
    if (exportIsClicked && nonPaginatedData && !nonPaginatedIsLoading) {
      // instead of getting from localStorage, use the data fetched from the API
      const csvData: ResultsRecord[] = (Array.isArray(data) ? data : []).map(
        (record) => ({
          schoolName: record.school,
          teamId: record.id,
          student1: {
            name: record.students[0]?.name as string,
            year_level: record.students[0]?.year_level,
            score: record.students[0]?.student_score,
          },
          student2: {
            name: record.students[1]?.name as string,
            year_level: record.students[1]?.year_level,
            score: record.students[1]?.student_score,
          },
          student3: {
            name: record.students[2]?.name as string,
            year_level: record.students[2]?.year_level,
            score: record.students[2]?.student_score,
          },
          student4: {
            name: record.students[3]?.name as string,
            year_level: record.students[3]?.year_level,
            score: record.students[3]?.student_score,
          },
          totalMarks: record.total_marks,
        }),
      );

      console.log("csv data: ", csvData);

      if (csvData.length === 0) {
        toast.warning("No data available to export.");
        return;
      }

      // CSV headers in the order you want them
      const csvHeaders = [
        "School Name",
        "Team ID",
        "Name",
        "Year",
        "Score",
        "Name",
        "Year",
        "Score",
        "Name",
        "Year",
        "Score",
        "Name",
        "Year",
        "Score",
        "Total Marks",
      ];

      // Build each row from csvData
      const csvRows = csvData.map((record) => [
        record.schoolName,
        record.teamId,
        record.student1.name,
        record.student1.year_level,
        record.student1.score,
        record.student2.name,
        record.student2.year_level,
        record.student2.score,
        record.student3.name,
        record.student3.year_level,
        record.student3.score,
        record.student4.name,
        record.student4.year_level,
        record.student4.score,
        record.totalMarks,
      ]);

      // Convert to CSV string
      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.map((value) => `"${value}"`).join(","))
        .join("\n");

      // Trigger a download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "TeamList_Results_WAJO.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="m-4 space-y-4">
      <h2 className="flex w-full items-center justify-center text-3xl font-bold">
        {quizName}
      </h2>
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={searchParams.search ?? ""}
          placeholder="Search Schools and Teams"
          onSearch={(newSearch: string) => {
            setAndPush({ search: newSearch, page: 1 });
          }}
        />
        <Suspense fallback={<div className="h-6 w-6 animate-pulse" />}>
          <Button
            variant="outline"
            className="h-auto"
            onClick={() => {
              setExportIsClicked(true);
            }}
          >
            Download CSV
          </Button>
        </Suspense>
      </div>

      <Suspense fallback={<WaitingLoader />}>
        <div>
          <TeamListDataGrid
            datacontext={data ?? []}
            isLoading={!isReady || isLoading}
            onOrderingChange={onOrderingChange}
          />
          <div className="flex items-center justify-between p-4">
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
