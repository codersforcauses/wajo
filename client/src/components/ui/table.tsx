import React from "react";

import { cn } from "@/lib/utils";

/**
 * The `Table` component renders a styled table with an optional title.
 * It provides a wrapper for the table with customizable class names and an optional title above the table. The title is displayed as a centered, bold text above the table.
 *
 * If a `title` is provided, it will be displayed in a prominent, centered position above the table. Otherwise, only the table itself will be rendered.
 *
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <Table title="User List">
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, title, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    {title && (
      <div className="py-3 text-center text-xl font-semibold text-gray-700">
        {title}
      </div>
    )}
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * The `TableHeader` component renders the header section of the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableHead>Name</TableHead>
 *     <TableHead>Email</TableHead>
 *   </TableRow>
 * </TableHeader>
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * The `TableBody` component renders the body section of the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableBody>
 *   <TableRow>
 *     <TableCell>John Doe</TableCell>
 *     <TableCell>john@example.com</TableCell>
 *   </TableRow>
 * </TableBody>
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * The `TableFooter` component renders the footer section of the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableFooter>
 *   <TableRow>
 *     <TableCell>Total</TableCell>
 *     <TableCell>2</TableCell>
 *   </TableRow>
 * </TableFooter>
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/**
 * The `TableRow` component renders a row inside the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableRow>
 *   <TableCell>John Doe</TableCell>
 *   <TableCell>john@example.com</TableCell>
 * </TableRow>
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * The `TableHead` component renders a header cell inside a `TableRow` in the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableHead>Name</TableHead>
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * The `TableCell` component renders a cell inside a `TableRow` within the `Table`.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableCell>John Doe</TableCell>
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * The `TableCaption` component renders a caption for the `Table`, usually used for adding a description or title.
 *
 * @see `Table` for full usage.
 * @see {@link https://ui.shadcn.com/docs/components/table} for more details.
 *
 * @component
 * @example
 * <TableCaption>User Information</TableCaption>
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
