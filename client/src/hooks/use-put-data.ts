import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";

interface UsePutMutationOptions<
  TData,
  TVariables,
  TError = AxiosError<{ error: string; message: string }>,
> extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationKey" | "mutationFn"
  > {
  mutationKey: string[];
  queryKeys: Array<string | number>[];
  endpoint: string;
  timeout?: number;
}

/**
 * Custom hook for performing a `PUT` request mutation with automatic cache invalidation and error handling.
 *
 * This hook wraps the `useMutation` hook from React Query, providing a way to update data on the server
 * and automatically invalidate related queries to keep the UI in sync.
 *
 * @template TData - The expected response data type from the API.
 * @template TVariables - The request payload type sent in the `PUT` request.
 * @template TError - The error type returned from the mutation (default is `AxiosError` with an error message structure).
 *
 * @param {string[]} mutationKey - A unique key for identifying the mutation in React Query.
 * @param {(string | number)[][]} queryKeys - An array of query keys to invalidate after a successful mutation.
 * @param {string} endpoint - The API endpoint to send the `PUT` request.
 * @param {number} [timeout=10000] - The timeout duration for the `PUT` request in milliseconds (default: 10 seconds).
 * @param {Omit<UseMutationOptions<TData, TError, TVariables>, "mutationKey" | "mutationFn">} [args]
 *        - Additional mutation options such as `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<TData, TError, TVariables>} - The mutation result, including methods like `mutate`, `isPending`, and `isError`.
 *
 * @example
 * const { mutate, isPending, isError } = usePutMutation<User, Partial<User>>(
 *   ["updateUser"],
 *   [["user", userId], ["users"]],
 *   `/api/users/${userId}`,
 *   15000,
 *   {
 *     onSuccess: () => {
 *       toast.success("User updated successfully");
 *     },
 *     onError: (error) => {
 *       console.error("Update failed", error);
 *     },
 *   }
 * );
 *
 * mutate({ name: "John Doe", email: "john@example.com" });
 */
export const usePutMutation = <
  TData,
  TVariables = unknown,
  TError = AxiosError<{ error: string; message: string }>,
>({
  mutationKey,
  queryKeys,
  endpoint,
  timeout = 10000,
  ...args
}: UsePutMutationOptions<TData, TVariables, TError>): UseMutationResult<
  TData,
  TError,
  TVariables
> => {
  const queryClient = useQueryClient();
  return useMutation<TData, TError, TVariables>({
    mutationKey,
    mutationFn: (variables: TVariables) =>
      api.put(endpoint, variables, { timeout }),
    onError: (error: TError) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (data, details, context) => {
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );
      if (args?.onSuccess) args.onSuccess(data, details, context);
    },
    ...args, // Spread additional mutation options
  });
};
