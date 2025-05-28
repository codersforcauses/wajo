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
import { QuizAttempts } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying information for quiz attempts.
 *
 * The `QuizAttemptsDataGrid` component displays a table with columns for student name, year level,
 * school information, and total marks. Users can sort the data by clicking on each sortable column’s
 * heading. The grid is updated whenever the `datacontext` prop changes or a column is re-sorted.
 *
 * @function IndividualDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `IndividualLeaderboard`.
 * @param {Object} props - The props object.
 * @param {QuizAttempts[]} props.datacontext - The array of Quiz Attempt leaderboard data items to be displayed.
 * @param {function(QuizAttempts[]): void} [props.onOrderingChange] - Callback triggered when a user clicks a sortable column header. Receives the field name to sort by.
 *
 */

export function QuizAttemptsDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<QuizAttempts>) {
  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  console.log("responses: ", datacontext[0].student_responses);
  console.log(
    "responses length: ",
    Object.keys(datacontext[0].student_responses || {}).length,
  );

  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Username</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("username")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Last Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student_lastname")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>First Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student_firstname")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>State</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("state")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Started On</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("started_on")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Completed</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("completed")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Time taken</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("time_taken")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Grade</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("grade")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Year level</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student_year_level")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              {datacontext.length > 0 &&
                Array.from(
                  {
                    length:
                      Object.keys(datacontext[0].student_responses || {})
                        .length || 0,
                  },
                  (_, i) => (
                    <TableHead key={i} className={cn(commonTableHeadClasses)}>
                      <div className="flex items-center text-white">
                        <span>Response {i + 1}</span>
                        <span
                          className="ml-2 cursor-pointer"
                          onClick={() =>
                            onOrderingChange(`student_responses.${i}`)
                          }
                        >
                          <SortIcon />
                        </span>
                      </div>
                    </TableHead>
                  ),
                )}
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
                    {item.username}
                  </TableCell>
                  <TableCell>{item.student_lastname}</TableCell>
                  <TableCell>{item.student_firstname}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.started_on}</TableCell>
                  <TableCell>{item.completed}</TableCell>
                  <TableCell>{item.time_taken}</TableCell>
                  <TableCell>{item.total_marks}</TableCell>
                  <TableCell>{item.student_year_level}</TableCell>
                  {datacontext.length > 0 &&
                    Array.from(
                      {
                        length:
                          Object.keys(datacontext[0].student_responses || {})
                            .length || 0,
                      },
                      (_, i) => (
                        <TableCell key={i}>
                          {item.student_responses?.[i] || "-"}
                        </TableCell>
                      ),
                    )}
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
