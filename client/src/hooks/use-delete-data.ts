import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";

/**
 * Custom hook for performing a DELETE request mutation.
 *
 * This hook provides a wrapper around the `useMutation` hook from React Query to handle DELETE requests using Axios.
 * It allows you to send a DELETE request to a specified API endpoint and automatically updates the React Query cache on success.
 *
 * @template TData - The type of the data returned from the API response.
 * @template TError - The type of the error returned from the mutation (default is `AxiosError`).
 * @template TVariables - The type of the variables that will be sent in the request body (default is `void`).
 *
 * @param {string[]} mutationKey - A unique key for identifying the mutation in React Query.
 * @param {string} endpoint - The API endpoint to which the DELETE request is sent.
 * @param {Array<string | number>[]} queryKeys - Array of query keys that should be invalidated after a successful mutation.
 * @param {number} [timeout=10000] - The timeout for the DELETE request in milliseconds. Defaults to 10000ms (10 seconds).
 * @param {UseMutationOptions<TData, TError, TVariables>} [args] - Optional configuration options for the mutation. This can include callbacks like `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<TData, TError, TVariables>} The result of the mutation, which includes properties like `mutate`, `isPending`, `isError`, etc.
 *
 * @example
 * const { mutate, isPending, isError } = useDeleteMutation(
 *   ["deleteItem"],
 *   "/api/items/1",
 *   [["items"]],
 *   5000,
 *   {
 *     onSuccess: () => {
 *       console.log("Item deleted successfully");
 *     },
 *     onError: (error) => {
 *       console.error("Failed to delete item", error);
 *     },
 *   }
 * );
 */

export const useDeleteMutation = <
  TData,
  TError = AxiosError<{ error: string; message: string }>,
  TVariables = void,
>(
  mutationKey: string[],
  endpoint: string,
  queryKeys: Array<string | number>[] = [],
  timeout: number = 10000, // Default timeout of 10 seconds
  args?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationKey" | "mutationFn"
  >,
): UseMutationResult<TData, TError, TVariables> => {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    ...args,
    mutationKey,
    mutationFn: () => {
      return api.delete(endpoint, { timeout });
    },
    onError: (error: TError) => {
      // extract error message from BE response
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(message || detailedError || "Something went wrong");
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
