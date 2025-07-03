import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import DateTimeDisplay from "@/components/ui/date-format";
import { SortIcon } from "@/components/ui/icon";
import { WaitingLoader } from "@/components/ui/loading";
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
import { AdminQuiz } from "@/types/quiz";

/**
 * Renders a paginated data grid for displaying competition information.
 *
 * The `CompetitionResultsDataGrid` component displays a table of competitions with pagination
 * and sorting functionality. It allows sorting by the competition status and handles
 * pagination of the data. The data grid updates when changes occur in the data context.
 *
 * @function CompetitionDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Competition`.
 * @param {Object} props - The props object.
 * @param {Competition[]} props.datacontext - The array of competition data items to be displayed in the grid.
 * @param {function(Competition[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 *   const [competitions, setCompetitions] = useState<Competition[]>([]);
 *   const [page, setPage] = useState(1);
 *
 *   const handleDataChange = (updatedData: Competition[]) => {
 *     setCompetitions(updatedData);
 *   };
 *
 *   return (
 *     <CompetitionResultsDataGrid
 *       datacontext={competitions}
 *       onDataChange={handleDataChange}
 *       changePage={page}
 *     />
 *   );
 */
export function CompetitionResultsDataGrid({
  datacontext,
  isLoading,
  startIdx,
  onOrderingChange = () => {},
}: DatagridProps<AdminQuiz>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>No.</TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("name")}
              >
                <SortIcon title="Name" />
              </TableHead>
              {/* <TableHead className={commonTableHeadClasses}>Intro</TableHead> */}
              <TableHead className={commonTableHeadClasses}>
                Total Marks
              </TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("open_time_date")}
              >
                <SortIcon title="Open Date" />
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Time Limit
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Time Window
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Num Attempts
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
            {!isLoading && datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  <TableCell className="w-0">
                    {startIdx ? startIdx + index : item.id}
                  </TableCell>
                  <TableCell className="w-1/4">{item.name}</TableCell>
                  {/* <TableCell className="w-1/2 max-w-80 truncate">
                    {item.intro}
                  </TableCell> */}
                  <TableCell className="w-0">{item.total_marks}</TableCell>
                  <TableCell className="w-0">
                    <DateTimeDisplay date={item.open_time_date} />
                  </TableCell>
                  <TableCell className="w-0">{item.time_limit}</TableCell>
                  <TableCell className="w-0">{item.time_window}</TableCell>
                  <TableCell className="w-0">
                    {item.quiz_attempt_count}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <Button asChild className="me-1">
                      <Link href={`${router.pathname}/${item.id}`}>
                        View Results
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-4 text-center text-gray-500"
                >
                  {isLoading ? (
                    <WaitingLoader className="p-0" />
                  ) : (
                    "No Results Found"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
