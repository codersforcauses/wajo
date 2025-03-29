import Link from "next/link";
import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { ProtectedPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
  toQueryString,
} from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import type { Student } from "@/types/user";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <UserList />
    </ProtectedPage>
  );
}

// For CSV export
type StoredRecord = {
  studentId: string;
  firstName: string;
  lastName: string;
  password: string;
  yearLevel: number | string;
  schoolName: string;
};

function UserList() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages, refetch } =
    useFetchDataTable<Student>({
      queryKey: ["students"],
      endpoint: "/users/students/",
      searchParams: searchParams,
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

  /**
   * Download a CSV file from the db data.
   * The CSV will contain the following columns:
   *   Student ID, First Name, Last Name, Year Level, School Name,
   */
  const downloadStudentsCSV = () => {
    // instead of getting from localStorage, use the data fetched from the API
    const storedData: StoredRecord[] = (data ?? [])
      .filter((record) => record.student_id !== undefined)
      .map((record) => ({
        studentId: record.student_id as string,
        firstName: record.first_name,
        lastName: record.last_name,
        password: record.plaintext_password ?? "N/A",
        yearLevel: record.year_level,
        schoolName: record.school.name,
      }));

    if (storedData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }

    // CSV headers in the order you want them
    const csvHeaders = [
      "Student ID",
      "First Name",
      "Last Name",
      "Password",
      "Year Level",
      "School Name",
    ];

    // Build each row from storedData
    const csvRows = storedData.map((record) => [
      record.studentId,
      record.firstName,
      record.lastName,
      record.password,
      record.yearLevel,
      record.schoolName,
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
    link.setAttribute("download", "Student_Data_WAJO.csv");
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
          placeholder="Search User"
          onSearch={(newSearch: string) => {
            setAndPush({ search: newSearch, page: 1 });
          }}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={`${router.pathname}/create`}>Create a Student</Link>
        </Button>
      </div>

      <Suspense>
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="h-auto"
            onClick={downloadStudentsCSV}
            disabled={isLoading}
          >
            Download this page as CSV
          </Button>
        </div>
        <div>
          <DataGrid
            datacontext={data ?? []}
            isLoading={!isReady || isLoading}
            startIdx={(searchParams.page - 1) * searchParams.nrows + 1}
            onDeleteSuccess={refetch}
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
