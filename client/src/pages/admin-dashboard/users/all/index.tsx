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

const UserPage: NextPageWithLayout = () => {
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    fetchStatus,
  } = useFetchData<User[]>({
    queryKey: ["users"],
    endpoint: "/users/users/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      console.log("users: ", users);
      setFilteredData(users);
    }
  }, [users]);

  useEffect(() => {
    console.log("fetchStatus: ", fetchStatus);
  }, [fetchStatus]);

  const handleFilterChange = (value: string) => {
    if (!users) return;

    const filtered =
      value.trim() === ""
        ? users
        : users.filter((item) => {
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

  if (isUsersLoading) return <WaitingLoader />;
  if (isUsersError) return <div>Error: {usersError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search User"
          onSearch={handleFilterChange}
        />
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
        usersRole="all"
      ></DataGrid>
    </div>
  );
};

UserPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default UserPage;
