import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { Category } from "@/types/question";

export function CategoryDataGrid({
  datacontext,
  isLoading,
  startIdx,
  onOrderingChange = () => {},
  onDeleteSuccess,
}: DatagridProps<Category>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>No.</TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("genre")}
              >
                <SortIcon title="Genre" />
              </TableHead>
              <TableHead className={commonTableHeadClasses}>Info</TableHead>
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
            {!isLoading && datacontext.length > 0 ? (
              datacontext.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  <TableCell className="w-0">
                    {startIdx ? startIdx + index : item.id}
                  </TableCell>
                  <TableCell className="w-1/4">{item.genre}</TableCell>
                  <TableCell className="w-3/4 max-w-80 truncate">
                    {item.info}
                  </TableCell>
                  <TableCell className="sticky right-0 flex bg-white">
                    <div className="flex w-full justify-between">
                      <Button asChild className="me-2">
                        <Link href={`${router.pathname}/${item.id}`}>View</Link>
                      </Button>
                      <DeleteModal
                        baseUrl="/questions/categories"
                        entity="category"
                        id={item.id}
                        onSuccess={onDeleteSuccess}
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
                  colSpan={4}
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
