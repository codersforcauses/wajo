import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";

interface UseUpdateMutationOptions<
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
 * Custom hook for performing a `PUT` request mutation with React Query and Axios.
 *
 * This hook provides an easy way to send `PUT` requests, handle errors, and automatically invalidate queries
 * after a successful mutation to keep the UI in sync.
 *
 * @template TData - The expected response data type from the API.
 * @template TVariables - The request payload type sent in the `PUT` request (default: `unknown`).
 * @template TError - The error type returned from the mutation (default: `AxiosError` with an error message structure).
 *
 * @param {Object} options - Configuration options for the mutation.
 * @param {string[]} options.mutationKey - A unique key for identifying the mutation in React Query.
 * @param {(string | number)[][]} options.queryKeys - An array of query keys to invalidate upon a successful mutation.
 * @param {string} options.endpoint - The API endpoint where the `PUT` request will be sent.
 * @param {number} [options.timeout=10000] - Timeout duration for the request in milliseconds (default: 10 seconds).
 * @param {Omit<UseMutationOptions<AxiosResponse<TData>, TError, TVariables>, "mutationKey" | "mutationFn">} [options.args]
 *        - Additional mutation options such as `onSuccess`, `onError`, etc.
 *
 * @returns {UseMutationResult<AxiosResponse<TData>, TError, TVariables>} - The mutation result object, which includes:
 *   - `mutate`: Function to trigger the mutation.
 *   - `isPending`: Boolean indicating if the mutation is in progress.
 *   - `isError`: Boolean indicating if an error occurred.
 *   - `data`: The response data from the API, if successful.
 *   - `error`: The error object, if the mutation failed.
 *
 * @example
 * const { mutate, isPending, isError } = usePutMutation<User, Partial<User>>({
 *   mutationKey: ["updateUser"],
 *   queryKeys: [["user", userId], ["users"]],
 *   endpoint: `/api/users/${userId}`,
 *   timeout: 15000,
 *   onSuccess: () => {
 *     toast.success("User updated successfully");
 *   },
 *   onError: (error) => {
 *     console.error("Update failed", error);
 *   },
 * });
 *
 * // Trigger the mutation
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
}: UseUpdateMutationOptions<
  AxiosResponse<TData>,
  TVariables,
  TError
>): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    mutationKey,
    mutationFn: (variables: TVariables) =>
      api.put(endpoint, variables, { timeout }),
    onError: (error: TError) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (response, details, context) => {
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );
      if (args?.onSuccess) args.onSuccess(response, details, context);
    },
    ...args, // Spread additional mutation options
  });
};

/**
 * Custom hook for performing a `PATCH` request mutation with React Query and Axios.
 *
 * This hook is similar to `usePutMutation` but is designed for partial updates using `PATCH` requests.
 *
 * @example
 * const { mutate, isPending, isError } = usePatchMutation<User, Partial<User>>({
 *   mutationKey: ["updateUser"],
 *   queryKeys: [["user", userId], ["users"]],
 *   endpoint: `/api/users/${userId}`,
 *   timeout: 10000,
 *   onSuccess: () => {
 *     toast.success("User updated successfully");
 *   },
 *   onError: (error) => {
 *     console.error("Update failed", error);
 *   },
 * });
 *
 * // Trigger the mutation
 * mutate({ name: "Jane Doe" });
 */
export const usePatchMutation = <
  TData,
  TVariables = unknown,
  TError = AxiosError<{ error: string; message: string }>,
>({
  mutationKey,
  queryKeys,
  endpoint,
  timeout = 10000,
  ...args
}: UseUpdateMutationOptions<
  AxiosResponse<TData>,
  TVariables,
  TError
>): UseMutationResult<AxiosResponse<TData>, TError, TVariables> => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    mutationKey,
    mutationFn: (variables: TVariables) =>
      api.patch(endpoint, variables, { timeout }),
    onError: (error: TError) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (response, details, context) => {
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );
      if (args?.onSuccess) args.onSuccess(response, details, context);
    },
    ...args, // Spread additional mutation options
  });
};

interface useDynamicMutationOptions<
  TData,
  TVariables,
  TError = AxiosError<{ error: string; message: string }>,
> extends Omit<
    UseMutationOptions<AxiosResponse<TData>, TError, TVariables>,
    "mutationKey" | "mutationFn"
  > {
  baseUrl: string;
  mutationKey: string[];
  queryKeys: Array<string | number>[];
  timeout?: number;
}

/**
 * Custom hook for performing a dynamic `PATCH` request mutation with React Query and Axios.
 *
 * This hook enables making `PATCH` requests to dynamically generated API endpoints based on the provided `id`.
 * It supports automatic query invalidation to keep the UI in sync after a successful update.
 *
 * @returns {UseMutationResult<AxiosResponse<TData>, TError, TVariables>} - The mutation result object, which includes:
 *   - `mutate`: Function to trigger the mutation.
 *   - `isPending`: Boolean indicating if the mutation is in progress.
 *   - `isError`: Boolean indicating if an error occurred.
 *   - `data`: The response data from the API, if successful.
 *   - `error`: The error object, if the mutation failed.
 *
 * @example
 * const { mutate, isPending, isError } = useDynamicPatchMutation<User, { id: number; data: Partial<User> }>({
 *   baseUrl: "/api/users",
 *   mutationKey: ["updateUser"],
 *   queryKeys: [["user", userId], ["users"]],
 *   timeout: 10000,
 *   onSuccess: () => {
 *     toast.success("User updated successfully");
 *   },
 *   onError: (error) => {
 *     console.error("Update failed", error);
 *   },
 * });
 *
 * // Trigger the mutation
 * mutate({ id: 123, data: { name: "John Doe" } });
 */
export const useDynamicPatchMutation = <
  TData,
  TVariables extends { id: number; data: any },
  TError = AxiosError<{ error: string; message: string }>,
>({
  baseUrl,
  mutationKey,
  queryKeys = [],
  timeout = 10000,
  ...args
}: useDynamicMutationOptions<TData, TVariables, TError>): UseMutationResult<
  AxiosResponse<TData>,
  TError,
  TVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<TData>, TError, TVariables>({
    ...args,
    mutationKey,
    mutationFn: ({ id, data }: TVariables) => {
      return api.patch(`${baseUrl}/${id}/`, data, { timeout });
    },
    onError: (error: TError) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: detailedError } = error.response.data;
        toast.error(detailedError || message || "Something went wrong");
      }
    },
    onSuccess: (response, variables, context) => {
      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      if (args?.onSuccess) args.onSuccess(response, variables, context);
    },
  });
};
