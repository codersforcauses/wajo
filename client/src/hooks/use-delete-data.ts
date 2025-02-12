import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";

interface useDynamicDeleteMutationOptions<TData, TVariables, TError>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationKey" | "mutationFn"
  > {
  baseUrl: string;
  mutationKey: string[];
  queryKeys?: Array<string | number>[]; // Optional query keys to invalidate after success
  timeout?: number; // Optional timeout for the request
}

/**
 * Custom hook for performing dynamic DELETE requests using React Query and Axios.
 *
 * This hook provides a flexible way to send DELETE requests to an API endpoint where
 * the resource ID is determined dynamically. It automatically invalidates specified query keys
 * upon successful deletion.
 *
 * @template TData - The type of the data returned from the API response.
 * @template TVariables - The type of the ID or parameters used in the DELETE request (default is `number`).
 * @template TError - The type of the error returned from the mutation (default is `AxiosError`).
 *
 * @param {Object} options - Configuration options for the mutation.
 * @param {string} options.baseUrl - The base URL for the DELETE request (e.g., `/api/items`).
 * @param {string[]} options.mutationKey - A unique key for identifying the mutation in React Query.
 * @param {Array<string | number>[]} [options.queryKeys=[]] - Optional array of query keys to invalidate after a successful mutation.
 * @param {number} [options.timeout=10000] - Optional timeout for the request in milliseconds (default: 10 seconds).
 * @param {UseMutationOptions<TData, TError, TVariables>} [options.args] - Additional mutation options like `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<AxiosResponse<TData>, TError, TVariables>} The result of the mutation, including `mutate`, `isPending`, `isError`, etc.
 *
 * @example
 * // Example usage for deleting an item dynamically by ID
 * const { mutate, isPending, isError } = useDynamicDeleteMutation({
 *   baseUrl: "/api/items",
 *   mutationKey: ["deleteItem"],
 *   queryKeys: [["items"]],
 *   timeout: 5000,
 *   onSuccess: () => {
 *     console.log("Item deleted successfully");
 *   },
 *   onError: (error) => {
 *     console.error("Failed to delete item", error);
 *   },
 * });
 *
 * // Trigger deletion of an item with ID 123
 * mutate(123);
 */
export const useDynamicDeleteMutation = <
  TData,
  TVariables = number,
  TError = AxiosError<{ error: string; message: string }>,
>({
  baseUrl,
  mutationKey,
  queryKeys = [],
  timeout = 10000,
  ...args
}: useDynamicDeleteMutationOptions<
  AxiosResponse<TData>,
  TVariables,
  TError
>): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    ...args,
    mutationKey,
    mutationFn: (id: TVariables) => {
      // dynamically set the endpoint for the DELETE request using the provided id
      return api.delete(`${baseUrl}/${id}/`, { timeout });
    },
    onError: (error: TError) => {
      // extract error message from BE response
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (data, variables, context) => {
      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      if (args?.onSuccess) args.onSuccess(data, variables, context);
    },
  });
};
