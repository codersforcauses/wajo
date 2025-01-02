"use client"; // Ensures the component is treated as a client-side component in Next.js

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Defines the base styles and variants for the `Label` component using `class-variance-authority`.
 *
 * The `labelVariants` provides utility classes for styling the label, including:
 * - Base font size (`text-sm`), weight (`font-medium`), and line height (`leading-none`).
 * - Disabled state (`peer-disabled:cursor-not-allowed` and `peer-disabled:opacity-70`).
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

/**
 * The `Label` component is a styled wrapper around the `@radix-ui/react-label` component.
 *
 * It provides a consistent style for form labels and supports variants for customization.
 * The component is accessible and responds to disabled states through the `peer-disabled` utility class.
 * @see {@link https://ui.shadcn.com/docs/components/label} for more details.
 * @example
 * <Label htmlFor="username">Username</Label>
 * <input id="username" type="text" />
 *
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} props - The props for the label component.
 * @param {string} props.className - Additional classes to customize the label styling.
 * @param {React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>} ref - A forwarded reference to the label element.
 *
 * @returns {React.Element} A styled label element.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
