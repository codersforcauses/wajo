import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

/**
 * The `Label` component is a styled label element that enhances accessibility and styling for form elements.
 * It provides an easy way to associate form controls with their respective labels, offering customization
 * via the `className` and `variant` props for different visual states.
 *
 * @see {@link https://ui.shadcn.com/docs/components/label} for more details.
 *
 * @component
 * @example
 * <Label htmlFor="username" className="text-blue-500">Username</Label>
 *
 * @param {string} [className] - Additional class names for customizing the style of the label.
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} props - Props passed to the underlying `LabelPrimitive.Root` component, including `htmlFor`, `id`, etc.
 * @param {VariantProps<typeof labelVariants>} variant - Variant props that apply different visual styles using `class-variance-authority`.
 *
 * @property {React.Ref} ref - A ref object that can be used to access the label element directly.
 *
 * @returns {JSX.Element} A styled label element, customizable with class variants and additional props.
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
