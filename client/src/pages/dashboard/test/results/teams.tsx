import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { ProtectedPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
  toQueryString,
} from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import { TeamDataGrid } from "@/components/ui/Test/team-data-grid";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
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
      <TeamLeaderboardIndex />
    </ProtectedPage>
  );
}

function TeamLeaderboardIndex() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [orderings, setOrderings] = useState<OrderingItem>({});

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    ordering: orderingToString(orderings),
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } =
    useFetchDataTable<TeamLeaderboard>({
      queryKey: ["results.team"],
      endpoint: "/results/team/",
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
    push({ query: toQueryString(updatedParams) }, undefined, { shallow: true });
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

  if (error) return <div>Error: {error.message}</div>;

  // For CSV export
  type ResultsRecord = {
    schoolName: string;
    teamId: Number | string;
    totalMarks: number;
    isCountrySchool: boolean;
    student1: string;
    student2: string;
    student3: string;
    student4: string;
    maxYearLevel: number;
  };

  /**
   * Download a CSV file from the db data.
   * The CSV will contain the following columns:
   *   School Name, Team Id, Total Marks, Is Country, Max Year Level, Student 1, Student 2, Student 3
   *   Student 4
   */
  const downloadTeamsCSV = () => {
    // instead of getting from localStorage, use the data fetched from the API
    const csvData: ResultsRecord[] = (data ?? []).map((record) => ({
      schoolName: record.school,
      teamId: record.id,
      totalMarks: record.total_marks,
      isCountrySchool: record.is_country,
      student1:
        (record.students[0]?.name as string) +
        " (" +
        record.students[0]?.year_level +
        ")",
      student2:
        (record.students[1]?.name as string) +
        " (" +
        record.students[1]?.year_level +
        ")",
      student3:
        (record.students[2]?.name as string) +
        " (" +
        record.students[2]?.year_level +
        ")",
      student4:
        (record.students[3]?.name as string) +
        " (" +
        record.students[3]?.year_level +
        ")",
      maxYearLevel: record.max_year,
    }));

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
      record.schoolName,
      record.teamId,
      record.totalMarks,
      record.isCountrySchool ? "Yes" : "No",
      record.student1,
      record.student2,
      record.student3,
      record.student4,
      record.maxYearLevel,
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
    link.setAttribute("download", "Team_Results_WAJO.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="m-4 space-y-4">
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
            onClick={downloadTeamsCSV}
          >
            Download CSV
          </Button>
        </Suspense>
      </div>

      <Suspense fallback={<WaitingLoader />}>
        <div>
          <TeamDataGrid
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
