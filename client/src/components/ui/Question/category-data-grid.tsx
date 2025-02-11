import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { useDynamicDeleteMutation } from "@/hooks/use-delete-data";
import { cn } from "@/lib/utils";
import { DatagridProps, sortData } from "@/types/data-grid";
import { Category } from "@/types/question";

export function CategoryDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Category>) {
  const router = useRouter();
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Category[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const sortByColumn = (column: keyof Category) => {
    const sortedData = sortData(datacontext, column, isAscending);
    setCurrentPage(1);
    onDataChange(sortedData);
    setIsAscending(!isAscending);
  };

  const { mutate: deleteCategory, isPending } = useDynamicDeleteMutation({
    baseUrl: "/questions/categories",
    mutationKey: ["category_delete"],
    onSuccess: () => {
      router.reload();
      toast.success("Category has been deleted.");
    },
  });

  const onDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    deleteCategory(id);
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
      updatedPaddedData.push({} as Category);
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
              Category Id
            </TableHead>
            <TableHead className={commonTableHeadClasses}>
              <div className="flex items-center text-white">
                <span>Genre</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("genre")}
                >
                  <SortIcon />
                </span>
              </div>
            </TableHead>
            <TableHead className={commonTableHeadClasses}>Info</TableHead>
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
              <TableCell className="w-1/3">{item.id}</TableCell>
              <TableCell className="w-1/3">{item.genre}</TableCell>
              <TableCell className="w-1/3">{item.info}</TableCell>
              <TableCell className="flex py-4">
                <div
                  className={cn("flex w-full justify-between", {
                    invisible: !item.id,
                  })}
                >
                  <Button
                    className="me-2"
                    onClick={() => router.push(`/question/category/${item.id}`)}
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
        onPageChange={(page: number) => handlePageChange(page)}
        className="mr-20 mt-5 flex justify-end"
      />
    </div>
  );
}
