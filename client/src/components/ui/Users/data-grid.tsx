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
import { cn } from "@/lib/utils";
import { useTokenStore } from "@/store/token-store";
import { DatagridProps } from "@/types/data-grid";
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
  usersRole,
}: DatagridProps<User>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<User[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);
  const { access } = useTokenStore(); // access the JWT token
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
    // wait for auth to be checked before rendering
    setIsAuthChecked(true);
  }, [access]);

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
    console.log("datacontext: ", datacontext);
  }, [datacontext]);

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse text-left shadow-md">
        <TableHeader className="w-full bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
              User Id
            </TableHead>
            <TableHead className={commonTableHeadClasses}>User Name</TableHead>
            <TableHead className={commonTableHeadClasses}>First Name</TableHead>
            <TableHead className={commonTableHeadClasses}>Last Name</TableHead>
            {usersRole == "all" && (
              <TableHead className={commonTableHeadClasses}>
                User Role
              </TableHead>
            )}
            {usersRole != "admin" && (
              <TableHead className={commonTableHeadClasses}>School</TableHead>
            )}
            {usersRole != "student" && usersRole != "all" && (
              <TableHead className={commonTableHeadClasses}>Email</TableHead>
            )}
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/4">{item.id}</TableCell>
              {
                <TableCell className="w-1/4">
                  {!item.id
                    ? ""
                    : item.username
                      ? item.username
                      : item.student_id
                        ? item.student_id
                        : "-"}
                </TableCell>
              }
              {
                <TableCell className="w-1/4">
                  {!item.id ? "" : item.first_name ? item.first_name : "-"}
                </TableCell>
              }
              {
                <TableCell className="w-1/4">
                  {!item.id ? "" : item.last_name ? item.last_name : "-"}
                </TableCell>
              }
              {usersRole == "all" && (
                <TableCell className="w-1/4">{item.role}</TableCell>
              )}
              {usersRole != "admin" && item.id && (
                <TableCell className="w-1/4">
                  {item.school?.name ? item.school.name : "-"}
                </TableCell>
              )}
              {usersRole != "student" && usersRole != "all" && item.id && (
                <TableCell className="w-1/4">
                  {item.email
                    ? item.email
                    : usersRole == "teacher"
                      ? item.email
                      : "-"}
                </TableCell>
              )}
              <TableCell className="flex py-4">
                <div className={cn("flex", { invisible: !item.id })}>
                  <Button className="me-2">View</Button>
                  <Button
                    variant={"destructive"}
                    className={cn("", {
                      invisible: usersRole === "admin",
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
