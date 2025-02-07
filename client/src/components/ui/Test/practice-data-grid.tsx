import { useRouter } from "next/router";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/ui/delete-modal";
import { SortIcon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDynamicPatchMutation } from "@/hooks/use-put-data";
import { cn } from "@/lib/utils";
import { DatagridProps } from "@/types/data-grid";
import { AdminQuiz } from "@/types/quiz";

/**
 * Renders a paginated data grid for displaying practice data.
 *
 * The `PracticeDataGrid` component displays a table with columns for name, status, and action buttons
 * for publishing, withdrawing, and deleting practice items. The data is paginated, and pagination
 * controls are provided to navigate through the data.
 *
 * @function PracticeDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Practice`.
 * @param {Object} props - The props object.
 * @param {Practice[]} props.datacontext - The array of practice data to be displayed in the grid.
 * @param {function(Practice[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * <PracticeDataGrid
 *   datacontext={practiceData}
 *   onDataChange={handlePracticeDataChange}
 *   changePage={currentPage}
 * />
 */
export function PracticeDataGrid({
  datacontext,
  onOrderingChange = () => {},
}: DatagridProps<AdminQuiz>) {
  const router = useRouter();

  const { mutate: setVisible, isPending } = useDynamicPatchMutation({
    baseUrl: "/quiz/admin-quizzes",
    queryKeys: [["quiz.admin-quizzes"], ["competition.visible"]],
    mutationKey: ["competition.visible"],
    onSuccess: () => {
      toast.success(`The competition has been updated.`);
      router.reload();
    },
  });

  const onVisible = (id: number, visible: boolean) => {
    setVisible({
      id: id,
      data: { visible },
    });
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="grid">
      <div className="overflow-hidden rounded-lg border">
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className={commonTableHeadClasses}>Id</TableHead>
              <TableHead
                className={commonTableHeadClasses}
                onClick={() => onOrderingChange("name")}
              >
                <SortIcon title="Name" />
              </TableHead>
              <TableHead className={commonTableHeadClasses}>Intro</TableHead>
              <TableHead className={commonTableHeadClasses}>
                Total Marks
              </TableHead>
              <TableHead className={commonTableHeadClasses}>
                Time Limit
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
                  <TableCell className="w-1/4">{item.name}</TableCell>
                  <TableCell className="w-1/2 max-w-80 truncate">
                    {item.intro}
                  </TableCell>
                  <TableCell className="w-0">{item.total_marks}</TableCell>
                  <TableCell className="w-0">{item.time_limit}</TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <div className="flex w-full justify-between">
                      <Button
                        className="me-1"
                        onClick={() => router.push(`/test/${item.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        className="me-1"
                        onClick={() => onVisible(item.id, !item.visible)}
                        disabled={isPending}
                      >
                        {isPending
                          ? "Processing..."
                          : item.visible
                            ? "Withdraw"
                            : "Publish"}
                      </Button>
                      <DeleteModal
                        baseUrl="/quiz/admin-quizzes"
                        entity="practice"
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
                  colSpan={8}
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
