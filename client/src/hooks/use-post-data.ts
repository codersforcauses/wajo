import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/api";

/**
 * Custom hook for performing a POST request mutation.
 *
 * This hook provides a wrapper around the `useMutation` hook from React Query to handle POST requests using Axios.
 * It allows you to send data to a specified API endpoint and automatically updates the React Query cache on success.
 *
 * @template TData - The type of the data returned from the API response.
 * @template TError - The type of the error returned from the mutation (default is `AxiosError`).
 * @template TVariables - The type of the variables that will be sent in the request body.
 *
 * @param {string[]} mutationKey - A unique key for identifying the mutation in React Query.
 * @param {string} endpoint - The API endpoint to which the POST request is sent.
 * @param {number} [timeout=10000] - The timeout for the POST request in milliseconds. Defaults to 10000ms (10 seconds).
 * @param {UseMutationOptions<TData, TError, TVariables>} [args] - Optional configuration options for the mutation. This can include callbacks like `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<TData, TError, TVariables>} The result of the mutation, which includes properties like `mutate`, `isLoading`, `isError`, etc.
 *
 * @example
 * const { mutate, isLoading, isError } = usePostMutation(["login"], "/api/login", {
 *   onSuccess: () => {
 *     console.log("Logged in successfully");
 *   },
 *   onError: (error) => {
 *     console.error("Login failed", error);
 *   }
 * });
 */
export const usePostMutation = <
  TData,
  TError = AxiosError,
  TVariables = unknown,
>(
  mutationKey: string[],
  endpoint: string,
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
    mutationFn: (variables: TVariables) => {
      return api.post(endpoint, variables, { timeout });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mutationKey] });
    },
  });
};