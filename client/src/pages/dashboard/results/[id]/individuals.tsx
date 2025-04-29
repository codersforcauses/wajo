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
import { SearchInput } from "@/components/ui/search";
import { IndividualDataGrid } from "@/components/ui/Test/individual-data-grid";
import { useFetchData, useFetchDataTable } from "@/hooks/use-fetch-data";
import {
  OrderingItem,
  orderingToString,
  stringToOrdering,
} from "@/types/data-grid";
import { IndividualLeaderboard } from "@/types/leaderboard";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <ResultsLayout>
        <IndividualLeaderboardIndex />
      </ResultsLayout>
    </ProtectedPage>
  );
}

function IndividualLeaderboardIndex() {
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
    useFetchDataTable<IndividualLeaderboard>({
      queryKey: [`results.individual.${quizId}`],
      endpoint: `/results/individual/?quiz_id=${quizId}`,
      searchParams: searchParams,
    });

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
      `/dashboard/results/${quizId}/individuals`,
      {
        shallow: true,
      },
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
  } = useFetchData<IndividualLeaderboard>({
    queryKey: [`results.individual.${quizId}.non-paginated`],
    endpoint: `/results/individual/non_paginated/?quiz_id=${quizId}`,
    enabled: exportIsClicked,
  });

  useEffect(() => {
    if (exportIsClicked && !nonPaginatedIsLoading && nonPaginatedData) {
      downloadStudentsCSV(nonPaginatedData);
      setExportIsClicked(false); // Reset the state
    }
  }, [exportIsClicked, nonPaginatedData, nonPaginatedIsLoading]);

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady || isLoading) return <WaitingLoader />;

  // For CSV export
  type ResultsRecord = {
    studentName: string;
    yearLevel: Number | string;
    schoolName: string;
    schoolType: string;
    isCountrySchool: boolean;
    totalMarks: number;
  };

  /**
   * Download a CSV file from the db data.
   * The CSV will contain the following columns:
   *   Student Name, year Level, School Type, is Country, Total Marks,
   */
  const downloadStudentsCSV = (data: IndividualLeaderboard) => {
    // instead of getting from localStorage, use the data fetched from the API
    const csvData: ResultsRecord[] = (Array.isArray(data) ? data : []).map(
      (record) => ({
        studentName: record.name,
        yearLevel: record.year_level,
        schoolName: record.school,
        schoolType: record.school_type,
        isCountrySchool: record.is_country,
        totalMarks: record.total_marks,
      }),
    );

    if (csvData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }

    // CSV headers in the order you want them
    const csvHeaders = [
      "Student Name",
      "Year Level",
      "School Name",
      "School Type",
      "Is Country School?",
      "Total Marks",
    ];

    // Build each row from csvData
    const csvRows = csvData.map((record) => [
      record.studentName,
      record.yearLevel,
      record.schoolName,
      record.schoolType,
      record.isCountrySchool ? "Yes" : "No",
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
    link.setAttribute("download", "Student_Results_WAJO.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          placeholder="Search Students"
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
          <IndividualDataGrid
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
