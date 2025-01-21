import React, { useEffect, useState } from "react";

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
import { DatagridProps } from "@/types/data-grid";
import { Ranking } from "@/types/leaderboard";

/**
 * Renders a paginated data grid for displaying ranking data.
 *
 * The `RankingDataGrid` component displays a table with columns for student name, team, school, marks,
 * and response time. The data is paginated, and pagination controls are provided to navigate through
 * the data.
 *
 * @function RankingDataGrid
 * @template T - The type of data being displayed in the grid, in this case, `Ranking`.
 * @param {Object} props - The props object.
 * @param {Ranking[]} props.datacontext - The array of ranking data to be displayed in the grid.
 * @param {function(Ranking[]): void} props.onDataChange - Callback triggered when the data changes.
 * @param {number} props.changePage - The page number to navigate to when the data changes.
 *
 * @example
 * <RankingDataGrid
 *   datacontext={rankingData}
 *   onDataChange={handleRankingDataChange}
 *   changePage={currentPage}
 * />
 */
export function RankingDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<Ranking>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Ranking[]>([]);
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
      updatedPaddedData.push({} as Ranking);
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
              Student Name
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>Team</TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>School</TableHead>
            <TableHead className={cn(commonTableHeadClasses, "text-center")}>
              Marks
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              Response Time
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/4">{item.student_name}</TableCell>
              <TableCell className="w-1/4">{item.team}</TableCell>
              <TableCell className="w-1/5">{item.school}</TableCell>
              <TableCell className="w-1/6 text-center">{item.marks}</TableCell>
              <TableCell className="">{item.response_time}</TableCell>
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
