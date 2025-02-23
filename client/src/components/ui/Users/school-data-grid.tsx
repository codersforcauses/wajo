import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/ui/delete-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { School } from "@/types/user";

/**
 * Renders a paginated data grid for displaying school information.
 *
 * The `SchoolDataGrid` component provides a table-based UI for displaying school data
 * with support for pagination. The behavior is similar to the `UserDataGrid`, but
 * it is tailored to display school-specific fields such as `School Id`, `School Name`,
 * and `Created On`.
 *
 * @see [UserDataGrid](./data-grid.tsx) for reference.
 */
export function SchoolDataGrid({
  datacontext,
  onOrderingChange,
}: DatagridProps<School>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>
                School Id
              </TableHead>
              <TableHead className={commonTableHeadClasses}>Name</TableHead>
              <TableHead className={commonTableHeadClasses}>Type</TableHead>
              <TableHead className={commonTableHeadClasses}>
                Is Country
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Abbreviation
              </TableHead>
              <TableHead
                className={cn(
                  commonTableHeadClasses,
                  "sticky right-0 bg-black",
                )}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="divide-gray-200 border-gray-50 text-sm text-black"
                >
                  <TableCell className="w-1/4">{item.id}</TableCell>
                  <TableCell className="w-1/4">{item.name}</TableCell>
                  <TableCell className="w-1/4">{item.type}</TableCell>
                  <TableCell className="w-1/4">
                    {item.is_country ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="w-1/4">{item.abbreviation}</TableCell>
                  <TableCell className="sticky right-0 flex bg-white">
                    <div className="flex w-full justify-between">
                      <Button asChild className="me-2">
                        <Link href={`${router.pathname}/${item.id}`}>View</Link>
                      </Button>
                      <DeleteModal
                        baseUrl="/users/schools"
                        entity="school"
                        id={item.id}
                      >
                        <Button variant={"destructive"}>Delete</Button>
                      </DeleteModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-4 text-center text-gray-500"
                >
                  No Results Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
