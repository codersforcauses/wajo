import { type ClassValue, clsx } from "clsx";
import { MutableRefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a new object by picking the specified keys from the given object.
 *
 * This function allows you to select specific properties from an object and returns a new object
 * containing only those properties. It uses the provided keys to extract the properties from the
 * original object and ensures the result is correctly typed.
 *
 * @example
 * const updatedParams = { search: 'test', ordering: 'asc', nrows: 10, page: 1 };
 * const queryParams = pickKeys(updatedParams, 'search', 'ordering');
 * // queryParams will be { search: 'test', ordering: 'asc' }
 *
 * @link Ref: https://stackoverflow.com/questions/67232195/filter-an-object-based-on-an-interface
 */
export function pickKeys<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}

/**
 * Throttles a function to only run once every specified delay.
 * @param fn - The function to throttle.
 * @param delay - The delay in milliseconds to throttle the function.
 * @param timeoutIdRef - A reference to the timeout ID to clear the timeout.
 * @returns A throttled function that only runs once every specified delay.
 *
 * This function is useful when you want to limit the number of times a function is called within a
 * specific time frame. It ensures that the function is only called once every specified delay and
 * prevents it from being called multiple times in quick succession.
 *
 * @example
 * const throttledFunction = throttle((value) => console.log(value), 1000);
 * throttledFunction('Hello'); // Does not log 'Hello'
 * throttledFunction('World'); // Logs 'World' after 1 second
 */
export const throttle = (
  fn: Function,
  delay: number,
  timeoutIdRef: MutableRefObject<NodeJS.Timeout | null>,
) => {
  return function (...args: any[]) {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      fn(...args);
      timeoutIdRef.current = null;
    }, delay);
  };
};
