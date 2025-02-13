import React, { useEffect, useState } from "react";

import { SortIcon } from "@/components/ui/icon";
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
import { DatagridProps, sortData } from "@/types/data-grid";
import { IndividualLeaderboard, Ranking } from "@/types/leaderboard";

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
export function IndividualDataGrid({
  datacontext,
  onDataChange,
  changePage,
}: DatagridProps<IndividualLeaderboard>) {
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<IndividualLeaderboard[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const sortByColumn = (column: keyof IndividualLeaderboard) => {
    const sortedData = sortData(datacontext, column, isAscending);
    setCurrentPage(1);
    onDataChange(sortedData);
    setIsAscending(!isAscending);
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
      updatedPaddedData.push({} as IndividualLeaderboard);
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
            <TableHead className={cn(commonTableHeadClasses)}>
              <div className="flex items-center text-white">
                <span>Year Level</span>
                <span className="ml-2 cursor-pointer"
                onClick={() => sortByColumn("year_level")}>
                  <SortIcon />
                </span>
                </div>
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>School</TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              School Type
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses)}>
              Is Country?
            </TableHead>
            <TableHead className={cn(commonTableHeadClasses, "rounded-tr-lg")}>
              <div className="flex items-center text-white">
                <span>Total Marks</span>
                <span className="ml-2 cursor-pointer"
                onClick={() => sortByColumn("total_marks")}>
                  <SortIcon />
                </span>
                </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/4">{item.name}</TableCell>
              <TableCell className="text-center">{item.year_level}</TableCell>
              <TableCell className="w-1/4">{item.school}</TableCell>
              <TableCell className="w-1/4">{item.school_type}</TableCell>
              <TableCell className="text-center">
                {item.is_country === true
                  ? "Yes"
                  : item.is_country === false
                    ? "No"
                    : ""}
              </TableCell>
              <TableCell className="text-center">{item.total_marks}</TableCell>
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
