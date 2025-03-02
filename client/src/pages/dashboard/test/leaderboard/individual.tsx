import { useRouter } from "next/router";
import React, { Suspense, useEffect, useState } from "react";

import { WaitingLoader } from "@/components/ui/loading";
import {
  Pagination,
  PaginationSearchParams,
  SelectRow,
} from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import { IndividualDataGrid } from "@/components/ui/Test/individual-data-grid"; 
import { useFetchDataTable } from "@/hooks/use-fetch-data";
import {
  OrderingItem,
  orderingToString,
  stringToOrdering,
} from "@/types/data-grid";
import { IndividualLeaderboard } from "@/types/leaderboard";

export default function IndividualLeaderboardIndex() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [orderings, setOrderings] = useState<OrderingItem>({});

  const [searchParams, setSearchParams] = useState<PaginationSearchParams>({
    ordering: orderingToString(orderings),
    search: "",
    nrows: 5,
    page: 1,
  });

  const { data, isLoading, error, totalPages } = useFetchDataTable<IndividualLeaderboard>({
    queryKey: ["leaderboard.individual"],
    endpoint: "/leaderboard/individual/",
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
  }, [query.ordering, query.search, query.nrows, query.page, isReady, isLoading]);

  const setAndPush = (newParams: Partial<PaginationSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);
    push(
      {
        pathname: "/dashboard/test/leaderboard/individual",
        query: Object.fromEntries(
          Object.entries(updatedParams).filter(([_, v]) => Boolean(v))
        ),
      },
      undefined,
      { shallow: true }
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

  if (error) return <div>Error: {error.message}</div>;
  if (!isReady || isLoading) return <WaitingLoader />;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={searchParams.search ?? ""}
          placeholder="Search Students"
          onSearch={(newSearch: string) => {
            setAndPush({ search: newSearch, page: 1 });
          }}
        />
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
                onChange={(newNrows) => setAndPush({ nrows: Number(newNrows), page: 1 })}
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
