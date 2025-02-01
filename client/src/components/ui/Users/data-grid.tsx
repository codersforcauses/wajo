import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchData } from "@/hooks/use-fetch-data";
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { School } from "@/types/school";
import { User } from "@/types/user";

/**
 * Renders a paginated data grid for displaying user information.
 *
 * The `DataGrid` component provides a table-based UI for displaying user data
 * with support for pagination. It handles data slicing, empty cell padding,
 * and provides callback handlers for changes in data and pagination.
 *
 * @function DataGrid
 * @template T - The type of data being displayed in the data grid.
 * @param {Object} props - The props object.
 * @param {User[]} props.datacontext - The array of data items to be displayed in the grid.
 * @param {function(User[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * // Example usage
 * const users = [
 *   { id: 1, username: "admin", role: "admin", school: "Greenfield High" },
 *   { id: 2, username: "teacher1", role: "teacher", school: "Westwood Academy" },
 * ];
 *
 * const handleDataChange = (updatedData) => {
 *   console.log(updatedData);
 * };
 *
 * <DataGrid
 *   datacontext={users}
 *   onDataChange={handleDataChange}
 *   changePage={1}
 * />;
 */
export function DataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<User>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<User[]>([]);
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
    console.log("datacontext: ", datacontext);
    console.log("currentData: ", currentData);

    const updatedPaddedData = [...currentData];
    while (updatedPaddedData.length < itemsPerPage) {
      updatedPaddedData.push({} as User);
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
              User Id
            </TableHead>
            <TableHead className={commonTableHeadClasses}>User Name</TableHead>
            <TableHead className={commonTableHeadClasses}>User Role</TableHead>
            <TableHead className={commonTableHeadClasses}>School</TableHead>
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
              <TableCell className="w-1/4">{item.id}</TableCell>
              <TableCell className="w-1/4">
                {item.first_name
                  ? `${item.first_name} ${item.last_name}`
                  : item.username}
              </TableCell>
              <TableCell className="w-1/4">
                {item.role == "user" ? "admin" : item.role}
              </TableCell>
              {item.school ? (
                <TableCell className="w-1/4">{item.school.name}</TableCell>
              ) : item.id ? (
                <TableCell className="w-1/4">N/A</TableCell>
              ) : (
                <TableCell className="w-1/4"></TableCell>
              )}
              <TableCell className="flex py-4">
                <div className={cn("flex", { invisible: !item.id })}>
                  <Button className="me-2">View</Button>
                  <Button
                    variant={"destructive"}
                    className={cn("", {
                      invisible: !item.first_name,
                    })}
                  >
                    Delete
                  </Button>
                </div>
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
