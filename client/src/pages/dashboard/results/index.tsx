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
import { CompetitionResultsDataGrid } from "@/components/ui/Results/competition-results-data-grid";
import { SearchInput } from "@/components/ui/search";
import { useFetchData, useFetchDataTable } from "@/hooks/use-fetch-data";
import { pickKeys } from "@/lib/utils";
import {
  OrderingItem,
  orderingToString,
  stringToOrdering,
} from "@/types/data-grid";
import { AdminQuiz, QuizStatus } from "@/types/quiz";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Index />
    </ProtectedPage>
  );
}

type CustomSearchParams = PaginationSearchParams & {
  status: QuizStatus;
};

function Index() {
  const router = useRouter();
  const { query, isReady, push } = router;

  const [orderings, setOrderings] = useState<OrderingItem>({});

  const defaultSearchParams: PaginationSearchParams = {
    ordering: orderingToString(orderings),
    search: "",
    nrows: 5,
    page: 1,
  };

  const [searchParams, setSearchParams] = useState<CustomSearchParams>({
    status: QuizStatus.Upcoming,
    ...defaultSearchParams,
  });

  const { data, isLoading, error, totalPages, refetch } =
    useFetchDataTable<AdminQuiz>({
      queryKey: ["quiz.admin-quizzes"],
      endpoint: "/quiz/admin-quizzes/",
      searchParams: searchParams,
    });

  useEffect(() => {
    if (!isLoading) {
      setSearchParams((prev) => ({
        ...prev,
        ordering: (query.ordering as string) || prev.ordering,
        search: (query.search as string) || prev.search,
        nrows: Number(query.nrows) || prev.nrows,
        page: Number(query.page) || prev.page,
      }));
      setOrderings(stringToOrdering(query.ordering as string));
    }
  }, [query.ordering, query.search, query.nrows, query.page, !isLoading]);

  const setAndPush = (newParams: Partial<CustomSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);

    const queryParams = pickKeys(
      updatedParams,
      ...(Object.keys(defaultSearchParams) as []),
    );
    push({ query: toQueryString(queryParams) }, undefined, { shallow: true });
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

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={searchParams.search ?? ""}
          placeholder="Search Competition"
          onSearch={(newSearch: string) => {
            setAndPush({ search: newSearch, page: 1 });
          }}
        />
      </div>

      <Suspense>
        <div>
          <CompetitionResultsDataGrid
            datacontext={data ?? []}
            isLoading={!isReady || isLoading}
            startIdx={(searchParams.page - 1) * searchParams.nrows + 1}
            onOrderingChange={onOrderingChange}
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
