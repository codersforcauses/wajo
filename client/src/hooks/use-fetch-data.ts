import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
 * @property {Record<string, any>} [params] Optional query parameters to send with the API request.
 */
interface QueryConfig<TData, TError = AxiosError>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: any[];
  endpoint: string;
  params?: Record<string, any>;
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
 *
 * @returns {UseQueryResult<TData, TError>} The result from `useQuery`, including data, error, and loading state.
 */
export const useFetchData = <TData, TError = AxiosError>({
  queryKey,
  endpoint,
  params,
  ...options
}: QueryConfig<TData, TError>) => {
  return useQuery<TData, TError>({
    queryKey: [queryKey, endpoint, params],
    queryFn: async () => {
      const response = await api.get<TData>(endpoint, { params });
      return response.data;
    },
    ...options,
  });
};
