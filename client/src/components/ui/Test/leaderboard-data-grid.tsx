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
import { Leaderboard } from "@/types/leaderboard";

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
}: DatagridProps<Leaderboard>) {
  const router = useRouter();

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
                Name
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses, "text-center")}>
                Participant Students
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses, "text-center")}>
                Participant Teams
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
                  <TableCell className="w-2/5">{item.name}</TableCell>
                  <TableCell className="w-1/5 text-center">
                    {item.participant_students}
                  </TableCell>
                  <TableCell className="w-2/5 text-center">
                    {item.participant_teams}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <div className="flex w-full justify-between">
                      <Button className="me-2">
                        <Link href={`${router.pathname}/ranking`}>Ranking</Link>
                      </Button>
                      <Button className="me-2">
                        <Link href={`${router.pathname}/insight`}>Insight</Link>
                      </Button>
                    </div>
                  </TableCell>
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
