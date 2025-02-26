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

export function IndividualDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<IndividualLeaderboard>) {

  const commonTableHeadClasses = "w-auto text-white text-nowrap";

  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
              Student Name
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
            <TableHead className={cn(commonTableHeadClasses)}>School</TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>School Type</TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>Is Country?</TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
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
            datacontext.map((item, index) => (
              <TableRow
                key={index}
                className={"divide-gray-200 border-gray-50 text-sm text-black"}
              >
                <TableCell className="w-1/4">{item.name}</TableCell>
                <TableCell className="text-center">{item.year_level}</TableCell>
                <TableCell className="w-1/4">{item.school}</TableCell>
                <TableCell className="w-1/4">{item.school_type}</TableCell>
                <TableCell className="text-center">
                  {item.is_country === true
                    ? "Yes"
                    : item.is_country === false
                    ? "No"
                    : ""}
                </TableCell>
                <TableCell className="text-center">{item.total_marks}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                No Results Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
