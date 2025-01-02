// Import necessary components and utilities
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Pagination component acts as a container for the navigation structure.
 *
 * @param {string} className - Additional class names for styling.
 * @param {React.ComponentProps<"nav">} props - Additional props for the nav element.
 * @returns {JSX.Element} A navigation container for pagination.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

/**
 * PaginationContent component acts as a container for pagination items.
 *
 * @param {string} className - Additional class names for styling.
 * @param {React.ComponentProps<"ul">} props - Additional props for the ul element.
 * @returns {JSX.Element} A container for pagination items.
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/**
 * PaginationItem represents an individual item in the pagination.
 *
 * @param {string} className - Additional class names for styling.
 * @param {React.ComponentProps<"li">} props - Additional props for the li element.
 * @returns {JSX.Element} A single pagination item.
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/**
 * PaginationLinkProps defines the props for the PaginationLink component.
 *
 * @typedef {Object} PaginationLinkProps
 * @property {boolean} [isActive] - Indicates if the link is active.
 * @property {string} size - Size of the link button.
 */
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

/**
 * PaginationLink represents a clickable pagination link.
 *
 * @param {PaginationLinkProps} props - Props including isActive and size.
 * @returns {JSX.Element} A clickable pagination link.
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

/**
 * PaginationPrevious represents the "Previous" button.
 *
 * @param {React.ComponentProps<typeof PaginationLink>} props - Props for the PaginationPrevious component.
 * @returns {JSX.Element} A button to navigate to the previous page.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

/**
 * PaginationNext represents the "Next" button.
 *
 * @param {React.ComponentProps<typeof PaginationLink>} props - Props for the PaginationNext component.
 * @returns {JSX.Element} A button to navigate to the next page.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

/**
 * PaginationEllipsis represents a visual indicator for more pages.
 *
 * @param {React.ComponentProps<"span">} props - Props for the PaginationEllipsis component.
 * @returns {JSX.Element} An ellipsis indicating more pages.
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

// Export all components for external use
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
