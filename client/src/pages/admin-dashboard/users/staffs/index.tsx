import Link from "next/link";
import React, { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { NextPageWithLayout } from "@/pages/_app";
import type { User } from "@/types/user";

const StaffsPage: NextPageWithLayout = () => {
  const {
    data: staffs,
    isLoading: isStaffsLoading,
    isError: isStaffsError,
    error: staffsError,
    fetchStatus,
  } = useFetchData<User[]>({
    queryKey: ["staffs"],
    endpoint: "/users/staffs/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (staffs) {
      console.log("staffs: ", staffs);
      setFilteredData(staffs);
    }
  }, [staffs]);

  useEffect(() => {
    console.log("fetchStatus: ", fetchStatus);
  }, [fetchStatus]);

  const handleFilterChange = (value: string) => {
    if (!staffs) return;

    const filtered =
      value.trim() === ""
        ? staffs
        : staffs.filter((item) => {
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

  if (isStaffsLoading) return <WaitingLoader />;
  if (isStaffsError) return <div>Error: {staffsError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <h1 className="pt-1 text-center text-2xl font-semibold">Staff Users</h1>
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search User"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"staffs/create_staffs"}>Create a Staff user</Link>
        </Button>
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
        usersRole="admin"
      ></DataGrid>
    </div>
  );
};

StaffsPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default StaffsPage;
