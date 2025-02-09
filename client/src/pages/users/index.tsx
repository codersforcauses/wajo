import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { User } from "@/types/user";

export default function UserList() {
  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserError,
    error: UserError,
  } = useFetchData<User[]>({
    queryKey: ["users.students"],
    endpoint: "/users/students/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      setFilteredData(users);
    }
  }, [users]);

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
              ? item.username.toLowerCase() === normalizedQuery
              : item.username.toLowerCase().includes(normalizedQuery);
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isUserLoading) return <WaitingLoader />;
  if (isUserError) return <div>Error: {UserError?.message}</div>;

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
          <Link href={"users/create"}>Create a User</Link>
        </Button>
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></DataGrid>
    </div>
  );
}
