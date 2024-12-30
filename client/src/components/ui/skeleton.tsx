import { cn } from "@/lib/utils";

/**
 * Skeleton component used to display a loading placeholder in the form of a pulse animation.
 * This component is often used for loading states where content is expected to appear later.
 * It accepts additional custom styles via the `className` prop.
 *
 * @see https://ui.shadcn.com/docs/components/skeleton
 *
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
