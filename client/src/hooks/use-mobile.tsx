import React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current viewport is considered mobile based on a given breakpoint.
 * The hook listens for changes in window width and returns a boolean value indicating whether the
 * screen size is smaller than the specified mobile breakpoint (768px by default).
 *
 * @returns {boolean} `true` if the viewport width is less than the mobile breakpoint, `false` otherwise.
 *
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
