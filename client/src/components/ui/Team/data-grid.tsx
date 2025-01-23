import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../button";
import { Pagination } from "../pagination";

/**
 * The Datagrid component is a flexible, paginated data table with sorting and navigation features.
 *
 * @param {TeamDatagridProps} props - Props including datacontext (data array), onDataChange (callback for data update), and ChangePage (external control for current page).
 */
export function TeamDatagrid({
  datacontext,
  onDataChange,
  changePage,
}: TeamDatagridProps) {
  // State to track sorting direction
  const [isAscending, setIsAscending] = useState(true);
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to hold padded data for consistent rows
  const [paddedData, setPaddedData] = useState<Team[]>([]);
  // Number of items displayed per page
  const itemsPerPage = 5;
  // Calculate total pages based on the data length
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  /**
   * Handles sorting of the data based on a specified column.
   * @param {keyof Team} column - Column key to sort by.
   */
  const sortByColumn = (column: keyof Team) => {
    const sortedData = [...datacontext].sort((a, b) => {
      return isAscending
        ? a[column].localeCompare(b[column])
        : b[column].localeCompare(a[column]);
    });
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
      updatedPaddedData.push({
        teamId: "",
        name: "",
        studentName: "",
        schoolName: "",
        competitionPeriod: "",
      });
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
            <TableHead className="w-1/5 rounded-tl-lg text-white">
              <span>Team ID</span>
            </TableHead>
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>Name</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("name")}
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
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>Student Name</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("studentName")}
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
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>School Name</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("schoolName")}
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
            <TableHead className="w-1/5 rounded-tr-lg text-white">
              <div className="flex items-center text-white">
                <span>Competition Period</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("competitionPeriod")}
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/5">{item.teamId || "\u00A0"}</TableCell>
              <TableCell className="w-1/5">{item.name || "\u00A0"}</TableCell>
              <TableCell className="w-1/5">
                {item.studentName || "\u00A0"}
              </TableCell>
              <TableCell className="w-1/5">
                {item.schoolName || "\u00A0"}
              </TableCell>
              <TableCell className="w-1/5">
                {item.competitionPeriod || "\u00A0"}
              </TableCell>
              <TableCell className="flex justify-evenly py-4">
                {item.teamId ? (
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
        onPageChange={(page) => handlePageChange(page)}
        className="mr-20 mt-5 flex justify-end"
      />
    </div>
  );
}
