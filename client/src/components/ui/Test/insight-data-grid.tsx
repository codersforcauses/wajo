import * as React from "react";

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
import { Insight } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying insights on questions.
 *
 * The `InsightDataGrid` component displays a table of question insights with pagination.
 * It shows question name, genre, difficulty, and correct rate, and supports pagination
 * to navigate through the data. The data grid updates when changes occur in the data context.
 *
 * @function InsightDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Insight`.
 * @param {Object} props - The props object.
 * @param {Insight[]} props.datacontext - The array of insight data items to be displayed in the grid.
 * @param {function(Insight[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 *   const [insights, setInsights] = useState<Insight[]>([]);
 *   const [page, setPage] = useState(1);
 *
 *   const handleDataChange = (updatedData: Insight[]) => {
 *     setInsights(updatedData);
 *   };
 *
 *   return (
 *     <InsightDataGrid
 *       datacontext={insights}
 *       onDataChange={handleDataChange}
 *       changePage={page}
 *     />
 *   );
 */

export function InsightDataGrid({ datacontext }: DatagridProps<Insight>) {
  const commonTableHeadClasses = "w-1/10 text-white text-nowrap text-center ";

  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full table-fixed border-collapse shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={cn(commonTableHeadClasses)}></TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Total
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Public
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Catholic
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Independent
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Allies
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Country
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Year 7
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Year 8
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Year 9
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-gray-50 text-center text-lg text-black"
                >
                  <TableCell className="text-left font-semibold">
                    {item.category}
                  </TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>{item.public_count}</TableCell>
                  <TableCell>{item.catholic_count}</TableCell>
                  <TableCell>{item.independent_count}</TableCell>
                  <TableCell>{item.allies_count}</TableCell>
                  <TableCell>{item.country}</TableCell>
                  <TableCell>{item.year_7}</TableCell>
                  <TableCell>{item.year_8}</TableCell>
                  <TableCell>{item.year_9}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
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
