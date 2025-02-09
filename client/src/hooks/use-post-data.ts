import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";

/**
 * Custom hook for performing a POST request mutation using React Query and Axios.
 *
 * This hook provides a wrapper around the `useMutation` hook from React Query, allowing
 * for easy POST requests with automatic cache invalidation upon success.
 *
 * @template TData - The type of the data returned from the API response.
 * @template TVariables - The type of the variables that will be sent in the request body (default: `unknown`).
 * @template TError - The type of the error returned from the mutation (default: `AxiosError`).
 *
 * @param {string[]} mutationKey - A unique key for identifying the mutation in React Query.
 * @param {string} endpoint - The API endpoint to which the POST request is sent.
 * @param {number} [timeout=10000] - The timeout for the POST request in milliseconds (default: 10 seconds).
 * @param {Omit<UseMutationOptions<AxiosResponse<TData>, TError, TVariables>, "mutationKey" | "mutationFn">} [args]
 *   - Optional configuration options for the mutation, such as `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<AxiosResponse<TData>, TError, TVariables>}
 *   The result of the mutation, which includes:
 *   - `mutate`: A function to trigger the mutation.
 *   - `isPending`: A boolean indicating if the mutation is in progress.
 *   - `isError`: A boolean indicating if the mutation encountered an error.
 *   - `data`: The response data from the API, if successful.
 *   - `error`: The error object, if the mutation failed.
 *
 * @example
 * // Example usage for a login API call
 * const { mutate, isPending, isError } = usePostMutation<UserData, LoginCredentials>({
 *   mutationKey: ["login"],
 *   endpoint: "/api/login",
 *   onSuccess: (response) => {
 *     console.log("Login successful:", response.data);
 *   },
 *   onError: (error) => {
 *     console.error("Login failed:", error);
 *   },
 * });
 *
 * // Trigger login mutation
 * mutate({ email: "user@example.com", password: "securepassword" });
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
    UseMutationOptions<AxiosResponse<TData>, TError, TVariables>,
    "mutationKey" | "mutationFn"
  >,
): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    ...args,
    mutationKey,
    mutationFn: (variables: TVariables) => {
      return api.post(endpoint, variables, { timeout });
    },
    onError: (error: TError) => {
      // extract error message from BE response
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (response, details, context) => {
      queryClient.invalidateQueries({ queryKey: mutationKey });
      if (args?.onSuccess) args.onSuccess(response, details, context);
    },
  });
};
