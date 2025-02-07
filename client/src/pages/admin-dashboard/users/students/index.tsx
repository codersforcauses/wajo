import Link from "next/link";
import React, { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { NextPageWithLayout } from "@/pages/_app";
import type { Student, User } from "@/types/user";

const StudentsPage: NextPageWithLayout = () => {
  const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    fetchStatus,
  } = useFetchData<Student[]>({
    queryKey: ["students"],
    endpoint: "/users/students/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (students) {
      console.log("students: ", students);
      setFilteredData(students);
    }
  }, [students]);

  useEffect(() => {
    console.log("fetchStatus: ", fetchStatus);
  }, [fetchStatus]);

  const handleFilterChange = (value: string) => {
    if (!students) return;

    const filtered =
      value.trim() === ""
        ? students
        : students.filter((item) => {
            const query = value.toLowerCase().trim();
            const isExactMatch = query.startsWith('"') && query.endsWith('"');
            const normalizedQuery = isExactMatch ? query.slice(1, -1) : query;

            return isExactMatch
              ? `${item.first_name.toLowerCase()}${item.last_name.toLowerCase()}` ===
                  normalizedQuery
              : `${item.first_name.toLowerCase()}${item.last_name.toLowerCase()}`.includes(
                  normalizedQuery,
                );
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isStudentsLoading) return <WaitingLoader />;
  if (isStudentsError) return <div>Error: {studentsError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search User"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"students/create_students"}>Create a Student</Link>
        </Button>
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></DataGrid>
    </div>
  );
};

StudentsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default StudentsPage;
