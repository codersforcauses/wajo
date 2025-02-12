import { type ClassValue, clsx } from "clsx";
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
