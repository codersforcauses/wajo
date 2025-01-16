import * as SeparatorPrimitive from "@radix-ui/react-separator";
import React from "react";

import { cn } from "@/lib/utils";

/**
 * A customizable separator component that renders a horizontal or vertical line.
 *
 * This component uses Shadcn's `SeparatorPrimitive.Root` to create a separator element. It supports customization
 * for orientation (horizontal or vertical), decoration, and additional styling through the `className` prop.
 * By default, the separator is horizontal with a minimal border appearance, but it can be easily adjusted
 * to fit different layout needs.
 *
 * **Example usage**:
 * ```tsx
 * <Separator orientation="horiz  ontal" className="my-4" />
 * ```
 *
 * @param {string} [className] - Additional class names for custom styling.
 * @param {string} [orientation="horizontal"] - The orientation of the separator, can be "horizontal" or "vertical".
 * @param {boolean} [decorative=true] - If `true`, the separator is purely decorative and will not be read by screen readers.
 *
 * @see https://ui.shadcn.com/docs/components/separator
 *
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
