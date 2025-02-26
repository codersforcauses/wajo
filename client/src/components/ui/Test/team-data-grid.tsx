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

export function TeamDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<TeamLeaderboard>) {

  const commonTableHeadClasses = "w-auto text-white text-nowrap";

  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
            <div className="flex items-center text-white">
              <span>School</span>
              <span className="ml-2 cursor-pointer"
              onClick={() => onOrderingChange("school__name")}>
                <SortIcon />
                </span>
              </div>
              </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>Id</TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              <div className="flex items-center text-white">
              <span>Total Marks</span>
              <span className="ml-2 cursor-pointer"
              onClick={() => onOrderingChange("total_marks")}>
                <SortIcon />
              </span>
              </div>
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              Is Country?
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
            <div className="flex items-center text-white">
              <span>Max Year</span>
              <span className="ml-2 cursor-pointer"
              onClick={() => onOrderingChange("max_year")}>
                <SortIcon />
              </span>
              </div>
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              Student 1
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              Student 2
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              Student 3
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              Student 4
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        {datacontext.length > 0 ? (
  datacontext.map((item, index) => {
    const studentCells = Array(4)
      .fill(null)
      .map((_, i) => (
        <TableCell key={i} className="">
          {item.students?.[i]
            ? `${item.students[i].name} (${item.students[i].year_level})`
            : ""}
        </TableCell>
      ));

    return (
      <TableRow
        key={index}
        className="divide-gray-200 border-gray-50 text-sm text-black"
      >
        <TableCell className="w-1/4">{item.school}</TableCell>
        <TableCell className="w-1/4">{item.id}</TableCell>
        <TableCell className="text-center">{item.total_marks}</TableCell>
        <TableCell className="w-1/4">
          {item.is_country === true
            ? "Yes"
            : item.is_country === false
            ? "No"
            : ""}
        </TableCell>
        <TableCell className="text-center">{item.max_year}</TableCell>
        {studentCells}
      </TableRow>
    );
  })
) : (
  <TableRow>
    <TableCell colSpan={4} className="py-4 text-center text-gray-500">
      No Results Found
    </TableCell>
  </TableRow>
)}
                  </TableBody>
      </Table>
    </div>
  );
}
