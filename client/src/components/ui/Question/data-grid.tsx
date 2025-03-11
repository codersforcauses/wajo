import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

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
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { Question } from "@/types/question";

/**
 * The Datagrid component is a flexible, paginated data table with sorting and navigation features.
 *
 * @param {DatagridProps<Question>} props - Props including datacontext (data array), onDataChange (callback for data update), and ChangePage (external control for current page).
 */
export function Datagrid({
  datacontext,
  isLoading,
  startIdx,
  onDeleteSuccess,
  onOrderingChange = () => {},
}: DatagridProps<Question>) {
  const router = useRouter();

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>No.</TableHead>
              <TableHead className={commonTableHeadClasses}>Name</TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("categories")}
              >
                <SortIcon title="Categories" />
              </TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("diff_level")}
              >
                <SortIcon title="Marks" />
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Modified By
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Modified On
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
                  <TableCell className="w-1/2 max-w-80 truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {item.categories?.map((c) => c.genre).join(", ")}
                  </TableCell>
                  <TableCell className="w-1/4">{item.diff_level}</TableCell>
                  <TableCell className="w-0">{item.modified_by}</TableCell>
                  <TableCell className="w-0">
                    <DateTimeDisplay date={item.time_modified} />
                  </TableCell>
                  <TableCell className="sticky right-0 flex bg-white">
                    <div className="flex w-full justify-between">
                      <Button asChild className="me-2">
                        <Link href={`${router.pathname}/${item.id}`}>View</Link>
                      </Button>
                      <DeleteModal
                        baseUrl="/questions/question-bank"
                        entity="question"
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
                  colSpan={7}
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
