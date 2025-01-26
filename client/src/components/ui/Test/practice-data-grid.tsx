import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { DatagridProps } from "@/types/data-grid";
import { Practice } from "@/types/practice";

/**
 * Renders a paginated data grid for displaying practice data.
 *
 * The `PracticeDataGrid` component displays a table with columns for name, status, and action buttons
 * for publishing, withdrawing, and deleting practice items. The data is paginated, and pagination
 * controls are provided to navigate through the data.
 *
 * @function PracticeDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Practice`.
 * @param {Object} props - The props object.
 * @param {Practice[]} props.datacontext - The array of practice data to be displayed in the grid.
 * @param {function(Practice[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * <PracticeDataGrid
 *   datacontext={practiceData}
 *   onDataChange={handlePracticeDataChange}
 *   changePage={currentPage}
 * />
 */
export function PracticeDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Practice>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Practice[]>([]);
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
      updatedPaddedData.push({} as Practice);
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
            <TableHead className={commonTableHeadClasses}>Status</TableHead>
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
              <TableCell className="w-1/2">{item.status}</TableCell>
              <TableCell className="flex py-4">
                <div
                  className={cn("flex w-full justify-between", {
                    invisible: !item.name,
                  })}
                >
                  <Button className="me-2">View</Button>
                  <Button className="me-2">
                    {item.status === "Published" ? (
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
