import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { useDynamicDeleteMutation } from "@/hooks/use-delete-data";
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { School } from "@/types/user";

/**
 * Renders a paginated data grid for displaying school information.
 *
 * The `SchoolDataGrid` component provides a table-based UI for displaying school data
 * with support for pagination. The behavior is similar to the `UserDataGrid`, but
 * it is tailored to display school-specific fields such as `School Id`, `School Name`,
 * and `Created On`.
 *
 * @see [UserDataGrid](./data-grid.tsx) for reference.
 */
export function SchoolDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<School>) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<School[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const { mutate: deleteSchool, isPending } = useDynamicDeleteMutation({
    baseUrl: "/users/schools",
    mutationKey: ["school_delete"],
    onSuccess: () => {
      router.reload();
      toast.success("School has been deleted.");
    },
  });

  const onDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this school?")) {
      return;
    }
    deleteSchool(id);
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
      updatedPaddedData.push({} as School);
    }

    setPaddedData(updatedPaddedData);
  }, [datacontext, currentPage]);

  useEffect(() => {
    setCurrentPage(changePage);
  }, [datacontext]);

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="flex-grow">
      <Table className="w-full border-collapse overflow-scroll text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className={cn(commonTableHeadClasses, "rounded-tl-lg")}>
              School Id
            </TableHead>
            <TableHead className={commonTableHeadClasses}>
              School Name
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
              <TableCell className="w-1/4">
                {item.created_at ? (
                  <>
                    <div className="text-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-nowrap">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </div>
                  </>
                ) : null}
              </TableCell>
              <TableCell className="flex py-4">
                <div className={cn("flex", { invisible: !item.id })}>
                  <Button
                    className="me-2"
                    onClick={() => router.push(`school/${item.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => onDelete(item.id)}
                  >
                    {isPending ? "Deleting..." : "Delete"}
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
