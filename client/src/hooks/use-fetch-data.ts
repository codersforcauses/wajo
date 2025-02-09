import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { PaginationSearchParams } from "@/components/ui/pagination";
import api from "@/lib/api";

/**
 * The configuration object used by the `useFetchData` hook to make API requests.
 * It extends `UseQueryOptions` from `react-query`, omitting the `queryKey` and `queryFn` properties
 * since they are specified separately in `useFetchData`.
 *
 * @template TData The type of the data being fetched.
 * @template TError The type of the error, default is `AxiosError`.
 * @property {any[]} queryKey The unique key for the query, used for caching and refetching.
 * @property {string} endpoint The endpoint to make the API request to.
 * @property {number} [timeout=10000] Timeout for the API request in milliseconds (default is 10000ms).
 * @property {Record<string, any>} [params] Optional query parameters to send with the API request.
 */
interface QueryConfig<TData, TError = AxiosError>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: any[];
  endpoint: string;
  params?: Record<string, any>;
  timeout?: number;
}

/**
 * A custom hook that fetches data from an API using the `useQuery` hook from `react-query`.
 * This hook simplifies fetching data, including handling caching, background refetching, and error handling.
 *
 * @template TData The type of the data being fetched.
 * @template TError The type of the error, default is `AxiosError`.
 * @param {QueryConfig<TData, TError>} config The configuration for the query, including:
 *   - `queryKey`: The query key, used to uniquely identify the query.
 *   - `endpoint`: The API endpoint to make the request to.
 *   - `params`: Optional parameters to include in the request.
 *   - `options`: Additional `useQuery` options such as `onSuccess`, `onError`, etc.
 *   - `timeout`: Optional timeout for the API request in milliseconds (default is 10000ms).
 *
 * @returns {UseQueryResult<TData, TError>} The result from `useQuery`, including data, error, and loading state.
 */
export const useFetchData = <TData, TError = AxiosError>({
  queryKey,
  endpoint,
  params,
  timeout = 10000,
  ...options
}: QueryConfig<TData, TError>): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError>({
    queryKey: [queryKey, endpoint, params, timeout],
    queryFn: async () => {
      const response = await api.get<TData>(endpoint, { params, timeout });
      return response.data;
    },
    ...options,
  });
};

interface FetchTableDataOptions<T> {
  queryKey: string[];
  endpoint: string;
  searchParams: PaginationSearchParams;
  pageSize?: number;
}

/**
 * Custom hook for fetching paginated table data using React Query and Axios.
 *
 * This hook simplifies API calls for data tables by handling pagination, sorting, and searching.
 * It follows Django's ordering format and integrates with query parameters for flexible filtering.
 *
 * @template T - The expected type of the data items in the response.
 *
 * @param {Object} options - The options for fetching table data.
 * @param {string[]} options.queryKey - A unique key for caching and identifying the query in React Query.
 * @param {string} options.endpoint - The API endpoint from which data is fetched.
 * @param {PaginationSearchParams} options.searchParams - The search and pagination parameters.
 * @param {number} [options.pageSize] - Optional page size (number of rows per page). Defaults to `searchParams.nrows`.
 *
 * @example
 * const { data, isLoading, error, totalPages } = useFetchDataTable<User>({
 *   queryKey: ["users"],
 *   endpoint: "/api/users",
 *   searchParams: { search: "john", ordering: "-created_at", nrows: 10, page: 1 },
 * });
 *
 * if (isLoading) return <WaitingLoader />;
 * if (error) return error.message;
 *
 * return (
 *   <Table>
 *     {data?.map((user) => (
 *       <TableRow key={user.id}>{user.name}</TableRow>
 *     ))}
 *   </Table>
 * );
 */
export function useFetchDataTable<T>({
  queryKey,
  endpoint,
  searchParams,
}: FetchTableDataOptions<T>) {
  // Format sorting for Django's ordering format
  // https://www.django-rest-framework.org/api-guide/filtering/#orderingfilter
  const { search, ordering, nrows, page, ...customParams } = searchParams;
  const offset = (page - 1) * nrows;

  const { data, isLoading, error } = useQuery<{
    results: T[];
    count: number;
  }>({
    queryKey: [
      endpoint,
      offset,
      queryKey,
      page,
      nrows,
      ordering,
      search,
      customParams,
    ],
    queryFn: async () => {
      const response = await api.get(endpoint, {
        params: {
          limit: nrows,
          offset,
          ...(ordering ? { ordering } : {}),
          ...(search ? { search } : {}), // Include only if exists,
          ...(customParams ? { ...customParams } : {}),
        },
      });
      return response.data;
    },
  });

  const totalPages = data ? Math.ceil(data.count / nrows) : 1;
  return { data: data?.results, isLoading, error, totalPages };
}
