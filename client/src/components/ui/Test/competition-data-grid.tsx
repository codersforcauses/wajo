import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SortIcon } from "@/components/ui/icon";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DatagridProps, sortData } from "@/types/data-grid";
import { Competition, QuizStatus } from "@/types/quiz";

/**
 * Renders a paginated data grid for displaying competition information.
 *
 * The `CompetitionDataGrid` component displays a table of competitions with pagination
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
 *     <CompetitionDataGrid
 *       datacontext={competitions}
 *       onDataChange={handleDataChange}
 *       changePage={page}
 *     />
 *   );
 */
export function CompetitionDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Competition>) {
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Competition[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const sortByColumn = (column: keyof Competition) => {
    const sortedData = sortData(datacontext, column, isAscending);
    setCurrentPage(1);
    onDataChange(sortedData);
    setIsAscending(!isAscending);
  };

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
      updatedPaddedData.push({} as Competition);
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
              Name
            </TableHead>
            <TableHead className={commonTableHeadClasses}>
              Competition Time
            </TableHead>
            <TableHead className={commonTableHeadClasses}>
              <div className="flex items-center text-white">
                <span>Status</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("status")}
                >
                  <SortIcon />
                </span>
              </div>
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/2">{item.name}</TableCell>
              <TableCell className="w-1/4">
                {item.open_time_date ? (
                  <>
                    <div className="text-nowrap">
                      {new Date(item.open_time_date).toLocaleDateString()}
                    </div>
                    <div className="text-nowrap">
                      {new Date(item.open_time_date).toLocaleTimeString()}
                    </div>
                  </>
                ) : null}
              </TableCell>
              <TableCell className="w-1/2">{item.status}</TableCell>
              <TableCell className="flex py-4">
                <div
                  className={cn("flex w-full justify-between", {
                    invisible: !item.name,
                  })}
                >
                  <Button className="me-2">View</Button>
                  <Button className="me-2">
                    {item.status === QuizStatus.Finished ? (
                      <a href="/withdraw">Withdraw</a>
                    ) : (
                      <a href="/publish">Publish</a>
                    )}
                  </Button>
                  <Button variant={"destructive"}>Delete</Button>
                </div>
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
