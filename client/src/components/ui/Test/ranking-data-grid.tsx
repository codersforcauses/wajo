import React, { useEffect, useState } from "react";

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
import { Ranking } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying ranking data.
 *
 * The `RankingDataGrid` component displays a table with columns for student name, team, school, marks,
 * and response time. The data is paginated, and pagination controls are provided to navigate through
 * the data.
 *
 * @function RankingDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Ranking`.
 * @param {Object} props - The props object.
 * @param {Ranking[]} props.datacontext - The array of ranking data to be displayed in the grid.
 * @param {function(Ranking[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * <RankingDataGrid
 *   datacontext={rankingData}
 *   onDataChange={handleRankingDataChange}
 *   changePage={currentPage}
 * />
 */
export function RankingDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<Ranking>) {
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
                Student Name
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>Team</TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                School
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses, "text-center")}>
                Marks
              </TableHead>
              <TableHead
                className={cn(commonTableHeadClasses, "rounded-tr-lg")}
              >
                Response Time
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
                  <TableCell className="w-1/4">{item.student_name}</TableCell>
                  <TableCell className="w-1/4">{item.team}</TableCell>
                  <TableCell className="w-1/5">{item.school}</TableCell>
                  <TableCell className="w-1/6 text-center">
                    {item.marks}
                  </TableCell>
                  <TableCell className="">{item.response_time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
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
