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
import { QuestionAttempts } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying information for question attempts.
 *
 * The `QuestionAttemptsDataGrid` component displays a table with columns for student name, year level,
 * school information, and total marks. Users can sort the data by clicking on each sortable column’s
 * heading. The grid is updated whenever the `datacontext` prop changes or a column is re-sorted.
 *
 * @function IndividualDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `IndividualLeaderboard`.
 * @param {Object} props - The props object.
 * @param {QuestionAttempts[]} props.datacontext - The array of Question Attempt leaderboard data items to be displayed.
 * @param {function(QuestionAttempts[]): void} [props.onOrderingChange] - Callback triggered when a user clicks a sortable column header. Receives the field name to sort by.
 *
 */

export function QuestionAttemptsDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<QuestionAttempts>) {
  const commonTableHeadClasses = "w-auto text-white text-nowrap";

  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              {/* <TableHead
                className={cn(commonTableHeadClasses, "rounded-tl-lg")}
              >
                <div className="flex items-center text-white">
                  <span>Quiz Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("quiz_name")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead> */}
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Student Name</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student_name")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Student year level</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("student_year_level")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Question id</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("question_id")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Student Answer</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("answer_student")}
                  >
                    <SortIcon />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("is_correct")}
                  >
                    <SortIcon title="Is correct" />
                  </span>
                </div>
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                <div className="flex items-center text-white">
                  <span>Marks</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => onOrderingChange("marks_awarded")}
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
                  {/* <TableCell className="whitespace-nowrap">
                    {item.quiz_name}
                  </TableCell> */}
                  <TableCell>{item.student_name}</TableCell>
                  <TableCell>{item.student_year_level}</TableCell>
                  <TableCell>{item.question_id}</TableCell>
                  {/* <TableCell>{item.question_text}</TableCell> */}
                  <TableCell>{item.answer_student}</TableCell>
                  <TableCell>
                    {item.is_correct === true
                      ? "Yes"
                      : item.is_correct === false
                        ? "No"
                        : ""}
                  </TableCell>
                  <TableCell>{item.marks_awarded}</TableCell>
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
