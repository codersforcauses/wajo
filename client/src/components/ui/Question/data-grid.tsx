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
import { DatagridProps, sortData } from "@/types/data-grid";
import { Question } from "@/types/question";

/**
 * The Datagrid component is a flexible, paginated data table with sorting and navigation features.
 *
 * @param {DatagridProps<Question>} props - Props including datacontext (data array), onDataChange (callback for data update), and ChangePage (external control for current page).
 */
export function Datagrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Question>) {
  // State to track sorting direction
  const [isAscending, setIsAscending] = useState(true);
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to hold padded data for consistent rows
  const [paddedData, setPaddedData] = useState<Question[]>([]);
  // Number of items displayed per page
  const itemsPerPage = 5;
  // Calculate total pages based on the data length
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  /**
   * Handles sorting of the data based on a specified column.
   * @param {keyof Question} column - Column key to sort by.
   */
  const sortByColumn = (column: keyof Question) => {
    const sortedData = sortData(datacontext, column, isAscending);
    setCurrentPage(1); // Reset to the first page after sorting
    onDataChange(sortedData); // Update the parent with sorted data
    setIsAscending(!isAscending); // Toggle sorting direction
  };

  /**
   * Handles page change logic.
   * @param {number} page - The new page number.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Updates the displayed data based on the current page.
   * Pads the data to ensure consistent rows (e.g., always 5 rows).
   */
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = datacontext.slice(indexOfFirstItem, indexOfLastItem);

    // Ensure paddedData always has 5 rows
    const updatedPaddedData = [...currentData];
    while (updatedPaddedData.length < itemsPerPage) {
      updatedPaddedData.push({} as Question);
    }

    setPaddedData(updatedPaddedData);
  }, [datacontext, currentPage]);

  /**
   * Make the default page always 1 when search button makes any change
   */
  useEffect(() => {
    setCurrentPage(changePage);
  }, [datacontext]);

  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className="w-1/4 rounded-tl-lg text-white">
              <span>Name</span>
            </TableHead>
            <TableHead className="w-1/4">
              <div className="flex items-center text-white">
                <span>Genre</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("genre")}
                >
                  <svg
                    width="10"
                    height="19"
                    viewBox="0 0 10 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 19L0.669872 11.5H9.33013L5 19Z" fill="white" />
                    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="white" />
                  </svg>
                </span>
              </div>
            </TableHead>
            <TableHead className="w-1/4">
              <div className="flex items-center text-white">
                <span>Difficulty</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("difficulty")}
                >
                  <svg
                    width="10"
                    height="19"
                    viewBox="0 0 10 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 19L0.669872 11.5H9.33013L5 19Z" fill="white" />
                    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="white" />
                  </svg>
                </span>
              </div>
            </TableHead>
            <TableHead className="w-1/4 rounded-tr-lg text-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/4">{item.name || "\u00A0"}</TableCell>
              <TableCell className="w-1/4">{item.genre || "\u00A0"}</TableCell>
              <TableCell className="w-1/4">
                {item.difficulty || "\u00A0"}
              </TableCell>
              <TableCell className="flex justify-evenly py-4">
                {item.name ? (
                  <>
                    <Button>View</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </>
                ) : (
                  <div className="invisible flex">
                    <Button>View</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </div>
                )}
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
