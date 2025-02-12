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
import { School } from "@/types/insights";

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
export function InsightDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<Insight>) {
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
                Qeustion Name
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Genre
              </TableHead>
              <TableHead className={cn(commonTableHeadClasses)}>
                Difficulty
              </TableHead>
              <TableHead
                className={cn(
                  commonTableHeadClasses,
                  "text-center",
                  "rounded-tr-lg",
                )}
              >
                Correct Rate
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
                  <TableCell className="w-1/2">{item.question_name}</TableCell>
                  <TableCell className="w-1/4">{item.genre}</TableCell>
                  <TableCell className="">{item.difficulty}</TableCell>
                  <TableCell className="w-1/4 text-center">
                    {item.correct_rate}
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
