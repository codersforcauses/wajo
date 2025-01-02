// Import necessary modules and utilities
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The `Textarea` component is a styled `textarea` element designed for consistent UI and UX.
 * @see {@link https://ui.shadcn.com/docs/components/textarea} for more details.
 * @example
 * <Textarea placeholder="Enter your text here..." />
 *
 * @param {string} className - Additional class names for styling customization.
 * @param {React.ComponentProps<"textarea">} props - Props passed to the underlying `textarea` element.
 * @returns {JSX.Element} A styled `textarea` element.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

// Set the display name for better debugging in React DevTools
Textarea.displayName = "Textarea";

// Export the component for external use
export { Textarea };
