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
import { TeamLeaderboard } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying leaderboard information for teams.
 *
 * The `TeamListDataGrid` component displays a table with columns for school name, team ID,
 * total team marks, country school, maximum year level, and the names of each team member.
 * Users can sort the data by clicking on each sortable column. The grid is updated whenever
 * the `datacontext` prop changes or a column is re-sorted.
 *
 * @function TeamListDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `TeamLeaderboard`.
 * @param {Object} props - The props object.
 * @param {TeamLeaderboard[]} props.datacontext - The array of team leaderboard data items to be displayed.
 * @param {function(TeamLeaderboard[]): void} [props.onOrderingChange] - Callback triggered when a user clicks a sortable column header. Receives the field name to sort by.
 *
 */

export function TeamListDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<TeamLeaderboard>) {
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
                  <span>School Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("school__name")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Team I.D.</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("id")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Name</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Year</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Score
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Name</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Year</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Score
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Name</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Year</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Score
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Name</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Year</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Score
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Total Marks</span>
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
              datacontext.map((item, index) => {
                const studentCells = Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <>
                      <TableCell key={i} className="whitespace-nowrap">
                        {item.students?.[i] ? `${item.students[i].name}` : ""}
                      </TableCell>
                      <TableCell key={i} className="whitespace-nowrap">
                        {item.students?.[i]
                          ? `${item.students[i].year_level}`
                          : ""}
                      </TableCell>
                      <TableCell key={i} className="whitespace-nowrap">
                        {item.students?.[i]
                          ? `${item.students[i].student_score}`
                          : ""}
                      </TableCell>
                    </>
                  ));

                return (
                  <TableRow
                    key={index}
                    className="divide-gray-200 border-gray-50 text-sm text-black"
                  >
                    <TableCell>{item.school}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    {studentCells}
                    <TableCell>{item.total_marks}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
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
