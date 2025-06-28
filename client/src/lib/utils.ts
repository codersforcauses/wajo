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
export const useThrottle = (
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

/**
 * List of allowed URL protocols for sanitization.
 */
const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

/**
 * Sanitizes a URL to ensure it's using a safe protocol.
 * Falls back to "about:blank" if the protocol is unsupported.
 *
 * @param url - The input URL string to sanitize.
 * @returns A sanitized URL string.
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}

/**
 * Regular expression to validate general URL format.
 *
 * @see [StackOverflow](https://stackoverflow.com/a/8234912/2013580)
 */
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
/**
 * Validates a URL string against a general URL pattern.
 * Also allows "https://" as a minimal valid input.
 *
 * @param url - The URL string to validate.
 * @returns True if the URL is valid, otherwise false.
 */
export function validateUrl(url: string): boolean {
  return url === "https://" || urlRegExp.test(url);
}

/**
 * Converts an RGB color string (e.g., "rgb(255, 255, 255)") to HEX format (e.g., "#ffffff").
 *
 * @param rgb - A valid CSS RGB color string.
 * @returns A HEX color string, or the original input if parsing fails.
 */
export function rgbToHex(rgb: string): string {
  const match = rgb.match(/^rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/);
  if (!match) return rgb; // fallback to raw value if not a valid rgb format
  const [, r, g, b] = match.map(Number);
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
