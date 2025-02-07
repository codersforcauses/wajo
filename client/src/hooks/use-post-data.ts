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
 * @returns {UseMutationResult<TData, TError, TVariables>} The result of the mutation, which includes properties like `mutate`, `isPending`, `isError`, etc.
 *
 * @example
 * const { mutate, isPending, isError } = usePostMutation(["login"], "/api/login", {
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
  TVariables = unknown,
  TError = AxiosError<{ error: string; message: string }>,
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
      return api.post(endpoint, variables, { timeout }).then((res) => res.data);
    },
    onError: (error: TError) => {
      // extract error message from BE response
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (data, details, context) => {
      queryClient.invalidateQueries({ queryKey: mutationKey });
      if (args?.onSuccess) args.onSuccess(data, details, context);
    },
  });
};
