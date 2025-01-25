import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A collection of components for creating a popover using the Radix UI Popover primitives
 * and styled according to the ShadCN UI design system.
 *
 * @component
 *
 * @example
 *   <Popover>
 *     <PopoverTrigger>
 *       <button>Open Popover</button>
 *     </PopoverTrigger>
 *     <PopoverContent>
 *       <p>This is the content of the popover.</p>
 *     </PopoverContent>
 *   </Popover>
 *
 * @see {@link https://ui.shadcn.com/docs/components/popover | ShadCN UI Popover Documentation}
 * @see {@link https://www.radix-ui.com/docs/primitives/components/popover | Radix UI Popover Documentation}
 */
const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverContent, PopoverTrigger };
