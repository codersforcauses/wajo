import React, { useEffect, useState } from "react";

import { Pagination } from "@/components/ui/pagination";
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
export function InsightDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Insight>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Insight[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = datacontext.slice(indexOfFirstItem, indexOfLastItem);

    const updatedPaddedData = [...currentData];
    while (updatedPaddedData.length < itemsPerPage) {
      updatedPaddedData.push({} as Insight);
    }

    setPaddedData(updatedPaddedData);
  }, [datacontext, currentPage]);

  useEffect(() => {
    setCurrentPage(changePage);
  }, [datacontext]);

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
              Qeustion Name
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>Genre</TableHead>
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
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/2">{item.question_name}</TableCell>
              <TableCell className="w-1/4">{item.genre}</TableCell>
              <TableCell className="">{item.difficulty}</TableCell>
              <TableCell className="w-1/4 text-center">
                {item.correct_rate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => handlePageChange(page)}
        className="mr-20 mt-5 flex justify-end"
      />
    </div>
  );
}
