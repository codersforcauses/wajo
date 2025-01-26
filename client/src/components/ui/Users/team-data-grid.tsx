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
import { Team } from "@/types/team";

/**
 * Renders a paginated data grid for displaying team information.
 *
 * The `TeamDataGrid` component provides a table-based UI for displaying team data
 * with support for pagination. The behavior is similar to the `UserDataGrid`, but
 * it is tailored to display team-specific fields such as `Team Id`, `Team Name`,
 * `School`, `Description`, and `Created On`.
 *
 * Similar Implementation:
 * @see [UserDataGrid](./data-grid.tsx) for reference.
 */
export function TeamDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Team>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Team[]>([]);
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
      updatedPaddedData.push({} as Team);
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
              Team Id
            </TableHead>
            <TableHead className={commonTableHeadClasses}>Team Name</TableHead>
            <TableHead className={commonTableHeadClasses}>School</TableHead>
            <TableHead className={commonTableHeadClasses}>
              Description
            </TableHead>
            <TableHead className={commonTableHeadClasses}>Created On</TableHead>
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
              <TableCell className="w-1/4">{item.name}</TableCell>
              <TableCell className="w-1/4">{item.school}</TableCell>
              <TableCell className="w-1/4">{item.description}</TableCell>
              <TableCell className="w-1/4">
                {item.time_created ? (
                  <>
                    <div className="text-nowrap">
                      {new Date(item.time_created).toLocaleDateString()}
                    </div>
                    <div className="text-nowrap">
                      {new Date(item.time_created).toLocaleTimeString()}
                    </div>
                  </>
                ) : null}
              </TableCell>
              <TableCell className="flex py-4">
                <div className={cn("flex", { invisible: !item.id })}>
                  <Button className="me-2">View</Button>
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
