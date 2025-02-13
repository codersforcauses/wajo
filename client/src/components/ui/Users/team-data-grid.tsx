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
import { Team } from "@/types/team";

import DateTimeDisplay from "../date-format";

/**
 * Renders a paginated data grid for displaying team information.
 *
 * The `TeamDataGrid` component provides a table-based UI for displaying team data
 * with support for pagination. The behavior is similar to the `UserDataGrid`, but
 * it is tailored to display team-specific fields such as `Team Id`, `Team Name`,
 * `School`, `Description`, and `Created On`.
 *
 * Similar Implementation:
 * @see [UserDataGrid](./data-grid.tsx) for reference.
 */
export function TeamDataGrid({
  datacontext,
  onOrderingChange,
}: DatagridProps<Team>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>Team Id</TableHead>
              <TableHead className={commonTableHeadClasses}>
                Team Name
              </TableHead>
              <TableHead className={commonTableHeadClasses}>School</TableHead>
              <TableHead className={commonTableHeadClasses}>
                Description
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Created On
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
                  key={index}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  <TableCell className="w-0">{item.id}</TableCell>
                  <TableCell className="w-1/3 max-w-80 truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="w-1/3 max-w-80 truncate">
                    {item.school?.name}
                  </TableCell>
                  <TableCell className="w-1/3 max-w-80 truncate">
                    {item.description}
                  </TableCell>
                  <TableCell className="w-0">
                    <DateTimeDisplay date={item.time_created} />
                  </TableCell>
                  <TableCell className="sticky right-0 flex bg-white">
                    <div className="flex w-full justify-between">
                      <Button asChild className="me-2">
                        <Link href={`${router.pathname}/${item.id}`}>View</Link>
                      </Button>
                      <DeleteModal
                        baseUrl="/team/teams"
                        entity="team"
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
