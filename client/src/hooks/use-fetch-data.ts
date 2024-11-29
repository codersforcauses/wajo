import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/api";

interface QueryConfig<TData, TError = AxiosError>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn"> {
  queryKey: any[];
  endpoint: string;
  params?: Record<string, any>;
}

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
