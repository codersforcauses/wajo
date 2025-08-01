import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import DateTimeDisplay from "@/components/ui/date-format";
import DeleteModal from "@/components/ui/delete-modal";
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
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";
import { useTokenStore } from "@/store/token-store";
import { DatagridProps } from "@/types/data-grid";
import { Role, Student, Teacher, User } from "@/types/user";

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
  isLoading,
  startIdx,
  onDeleteSuccess,
  onOrderingChange = () => {},
}: DatagridProps<User | Student | Teacher>) {
  const { userId } = useAuth();
  const router = useRouter();
  const pathSegments = router.pathname.split("/");
  const entityName =
    pathSegments.find((segment) =>
      ["staffs", "students", "teachers"].includes(segment),
    ) || "users";

  const { access } = useTokenStore(); // access the JWT token

  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
  }, [access]);

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="w-full bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>No.</TableHead>
              <TableHead className={commonTableHeadClasses}>
                User Name
              </TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("first_name")}
              >
                <SortIcon title="First Name" />
              </TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("last_name")}
              >
                <SortIcon title="Last Name" />
              </TableHead>
              {role == Role.ADMIN && (
                <TableHead
                  className={commonTableHeadClasses}
                  onClick={() => onOrderingChange("school")}
                >
                  <SortIcon title="School" />
                </TableHead>
              )}
              <TableHead
                className={cn(commonTableHeadClasses, "rounded-tr-lg")}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {!isLoading && datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={index}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  <TableCell className="w-1/4">
                    {startIdx ? startIdx + index : item.id}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {!item.id
                      ? ""
                      : item.student_id
                        ? item.student_id
                        : item.username
                          ? item.username
                          : item.last_name && item.first_name
                            ? `${item.last_name}${item.first_name}`
                            : "-"}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {!item.id ? "" : item.first_name ? item.first_name : "-"}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {!item.id ? "" : item.last_name ? item.last_name : "-"}
                  </TableCell>
                  {role == Role.ADMIN && item.id && (
                    <TableCell className="w-1/4">
                      {item.school?.name ? item.school.name : "-"}
                    </TableCell>
                  )}
                  <TableCell className="flex py-4">
                    <div className={cn("flex", { invisible: !item.id })}>
                      {(entityName !== "staffs" ||
                        (entityName === "staffs" &&
                          item.id.toString() === userId?.toString())) && (
                        <Button asChild className="me-2">
                          <Link href={`${router.pathname}/${item.id}`}>
                            View
                          </Link>
                        </Button>
                      )}
                      {entityName !== "staffs" && (
                        <DeleteModal
                          baseUrl={`/users/${entityName}`}
                          entity={entityName.replace(/s$/, "")}
                          id={item.id}
                          onSuccess={onDeleteSuccess}
                        >
                          <Button
                            variant={"destructive"}
                            className={cn("", {
                              invisible: role !== Role.ADMIN,
                            })}
                          >
                            Delete
                          </Button>
                        </DeleteModal>
                      )}
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
