import Link from "next/link";
import React, { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { NextPageWithLayout } from "@/pages/_app";
import type { Teacher, User } from "@/types/user";

const TeachersPage: NextPageWithLayout = () => {
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
    error: teachersError,
    fetchStatus,
  } = useFetchData<Teacher[]>({
    queryKey: ["teachers"],
    endpoint: "/users/teachers/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (teachers) {
      console.log("teachers: ", teachers);
      setFilteredData(teachers);
    }
  }, [teachers]);

  useEffect(() => {
    console.log("fetchStatus: ", fetchStatus);
  }, [fetchStatus]);

  const handleFilterChange = (value: string) => {
    if (!teachers) return;

    const filtered =
      value.trim() === ""
        ? teachers
        : teachers.filter((item) => {
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

  if (isTeachersLoading) return <WaitingLoader />;
  if (isTeachersError) return <div>Error: {teachersError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <h1 className="pt-1 text-center text-2xl font-semibold">Teacher Users</h1>
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search User"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"teachers/create_teachers"}>Create a Teacher</Link>
        </Button>
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
        usersRole="teacher"
      ></DataGrid>
    </div>
  );
};

TeachersPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TeachersPage;
