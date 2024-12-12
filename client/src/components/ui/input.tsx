import React from "react";

import { cn } from "@/lib/utils";

/**
 * The `Input` component is a styled input field that accepts various HTML input attributes.
 * It provides a customizable, accessible input field with built-in styling and focuses on handling various states like focus, hover, and disabled.
 *
 * @see {@link https://ui.shadcn.com/docs/components/input} for more details.
 *
 * @component
 * @example
 * <Input type="text" placeholder="Enter your name" />
 *
 * @param {string} [className] - Additional class names for customizing the style of the input.
 * @param {string} [type="text"] - The type of the input, such as "text", "password", etc. Defaults to "text".
 * @param {React.ComponentProps<"input">} [props] - Additional props for the input element (e.g., `value`, `onChange`, `placeholder`).
 *
 * @property {React.Ref} ref - A ref object that can be used to access the input element directly.
 *
 * @returns {JSX.Element} A styled input field with various configurable attributes.
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
