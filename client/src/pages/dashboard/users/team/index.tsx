import Link from "next/link";
import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";

import { ProtectedPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
  toQueryString,
} from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import { TeamDataGrid } from "@/components/ui/Users/team-data-grid";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import type { Team } from "@/types/team";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <TeamList />
    </ProtectedPage>
  );
}

function TeamList() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages, refetch } =
    useFetchDataTable<Team>({
      queryKey: ["team.teams"],
      endpoint: "/team/teams/",
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

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={searchParams.search ?? ""}
          placeholder="Search Team"
          onSearch={(newSearch: string) => {
            setAndPush({ search: newSearch, page: 1 });
          }}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={`${router.pathname}/create`}>Create a Team</Link>
        </Button>
      </div>

      <Suspense>
        <div>
          <TeamDataGrid
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
