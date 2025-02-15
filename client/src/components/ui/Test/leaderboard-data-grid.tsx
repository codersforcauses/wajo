import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/components/ui/button";
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
 * Renders a paginated data grid for displaying leaderboard data.
 *
 * The `LeaderboardDataGrid` component displays a table with columns for name, participant students,
 * participant teams, and action buttons (ranking and insights). The data is paginated, and pagination
 * controls are provided to navigate through the data.
 *
 * @function LeaderboardDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Leaderboard`.
 * @param {Object} props - The props object.
 * @param {Leaderboard[]} props.datacontext - The array of leaderboard data to be displayed in the grid.
 * @param {function(Leaderboard[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * <LeaderboardDataGrid
 *   datacontext={leaderboardData}
 *   onDataChange={handleLeaderboardDataChange}
 *   changePage={currentPage}
 * />
 */
export function LeaderboardDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<IndividualLeaderboard>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
              Name
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "text-center")}>
              Participant Students
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "text-center")}>
              Participant Teams
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
          {datacontext.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-2/5">{item.name}</TableCell>
              <TableCell className="w-1/5 text-center">
                {item.name}
              </TableCell>
              <TableCell className="w-2/5 text-center">
                {item.school}
                {/* just for now */}
              </TableCell>
              <TableCell className="flex py-4">
                <div
                  className={cn("flex w-full justify-between", {
                    invisible: !item.name,
                  })}
                >
                  <Button className="me-2">
                    <Link href={`${router.pathname}/ranking`}>Ranking</Link>
                  </Button>
                  <Button className="me-2">
                    <Link href={`${router.pathname}/insight`}>Insight</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
    </div>
  );
}
