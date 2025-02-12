import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import DateTimeDisplay from "@/components/ui/date-format";
import DeleteModal from "@/components/ui/delete-modal";
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
import { Student } from "@/types/user";

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
 * @param {function(Student[]): void} props.onDataChange - Callback triggered when the data changes.
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
  onOrderingChange,
}: DatagridProps<Student>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>User Id</TableHead>
              <TableHead className={commonTableHeadClasses}>
                User Name
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                First Name
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Last Name
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                School Name
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Year Level
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Extension Time
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Created At
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
            {datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  <TableCell className="w-0">{item.id}</TableCell>
                  <TableCell className="w-0">{item.student_id}</TableCell>
                  <TableCell className="w-1/3">{item.first_name}</TableCell>
                  <TableCell className="w-1/3">{item.last_name}</TableCell>
                  <TableCell className="w-1/3 max-w-80 truncate">
                    {item.school?.name}
                  </TableCell>
                  <TableCell className="w-0">{item.year_level}</TableCell>
                  <TableCell className="w-0">{item.extenstion_time}</TableCell>
                  <TableCell className="w-0">
                    <DateTimeDisplay date={item.created_at} />
                  </TableCell>
                  <TableCell className="sticky right-0 flex bg-white">
                    <div className="flex w-full justify-between">
                      <Button
                        className="me-2"
                        onClick={() => router.push(`/users/${item.id}`)}
                      >
                        View
                      </Button>
                      <DeleteModal
                        baseUrl="/users"
                        entity="student"
                        id={item.id}
                      >
                        <Button variant={"destructive"}>Delete</Button>
                      </DeleteModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
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
