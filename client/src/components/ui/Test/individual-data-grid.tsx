import React from "react";

import { SortIcon } from "@/components/ui/icon";
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
import { IndividualLeaderboard } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying leaderboard information for individuals.
 *
 * The `IndividualDataGrid` component displays a table with columns for student name, year level,
 * school information, and Individual Score. Users can sort the data by clicking on each sortable column’s
 * heading. The grid is updated whenever the `datacontext` prop changes or a column is re-sorted.
 *
 * @function IndividualDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `IndividualLeaderboard`.
 * @param {Object} props - The props object.
 * @param {IndividualLeaderboard[]} props.datacontext - The array of individual leaderboard data items to be displayed.
 * @param {function(IndividualLeaderboard[]): void} [props.onOrderingChange] - Callback triggered when a user clicks a sortable column header. Receives the field name to sort by.
 *
 */

export function IndividualDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<IndividualLeaderboard>) {
  const commonTableHeadClasses = "w-auto text-white text-nowrap";

  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead
                className={cn(commonTableHeadClasses, "rounded-tl-lg")}
              >
                <div className="flex items-center text-white">
                  <span>Student Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() =>
                      onOrderingChange("student__user__first_name")
                    }
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Year Level</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student__year_level")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>School Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student__school__name")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                School Type
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Country School
              </TableHead>
              <TableHead
                className={cn(commonTableHeadClasses, "rounded-tr-lg")}
              >
                <div className="flex items-center text-white">
                  <span>Individual Score</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("total_marks")}
                  >
                    <SortIcon />
                  </span>
                </div>
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
                  <TableCell className="whitespace-nowrap">
                    {item.name}
                  </TableCell>
                  <TableCell>{item.year_level}</TableCell>
                  <TableCell>{item.school}</TableCell>
                  <TableCell>{item.school_type}</TableCell>
                  <TableCell>
                    {item.is_country === true
                      ? "Yes"
                      : item.is_country === false
                        ? "No"
                        : ""}
                  </TableCell>
                  <TableCell>{item.total_marks}</TableCell>
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
