import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The `Input` component is a styled HTML `<input>` element, with utility classes for consistent design and responsive behavior.
 *
 * It supports various input types, custom styling, and accessibility features such as focus-visible rings and disabled states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/input} for more details.
 *
 * @example
 * <Input type="text" placeholder="Enter your name" />
 *
 * @param {React.ComponentProps<"input">} props - Props for the input element.
 * @param {string} props.className - Optional additional CSS classes to customize the input styling.
 * @param {string} props.type - The type of the input element (e.g., "text", "password").
 * @param {React.Ref<HTMLInputElement>} ref - A forwarded reference to the input element.
 *
 * @returns {React.Element} A styled input element.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
