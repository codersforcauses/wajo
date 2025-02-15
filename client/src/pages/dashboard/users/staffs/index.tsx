import Link from "next/link";
import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";

import { ProtectedPage } from "@/components/page-config";
import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
} from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import type { User } from "@/types/user";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Staffs />
    </ProtectedPage>
  );
}

function Staffs() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } = useFetchDataTable<User>({
    queryKey: ["staffs"],
    endpoint: "/users/staffs/",
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
    push(
      {
        pathname: "/dashboard/users/staffs",
        query: Object.fromEntries(
          Object.entries(updatedParams).filter(([_, v]) => Boolean(v)),
        ),
      },
      undefined,
      { shallow: true },
    );
  };

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady || isLoading) return <WaitingLoader />;

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
          <Link href={`${router.pathname}/create`}>Create a Staff</Link>
        </Button>
      </div>

      <Suspense>
        <div>
          <DataGrid datacontext={data ?? []} />
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
