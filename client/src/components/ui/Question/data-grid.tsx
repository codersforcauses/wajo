import React, { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../button";

export function Datagrid({
  datacontext,
  onDataChange,
  ChangePage,
}: DatagridProps) {
  const [isAscending, setIsAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paddedData, setPaddedData] = useState<Question[]>([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(datacontext.length / itemsPerPage);

  const sortByColumn = (column: keyof Question) => {
    const sortedData = [...datacontext].sort((a, b) => {
      return isAscending
        ? a[column].localeCompare(b[column])
        : b[column].localeCompare(a[column]);
    });
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

    // Fill empty rows if less than itemsPerPage
    const updatedPaddedData = [...currentData];
    while (updatedPaddedData.length < itemsPerPage) {
      updatedPaddedData.push({ name: "", category: "", difficulty: "" });
    }

    setPaddedData(updatedPaddedData);
  }, [datacontext, currentPage]);

  useEffect(() => {
    setCurrentPage(ChangePage);
  }, [datacontext]);

  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className="w-1/4 rounded-tl-lg text-white">
              <span>Name</span>
            </TableHead>
            <TableHead className="w-1/4">
              <div className="flex items-center text-white">
                <span>Category</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("category")}
                >
                  <svg
                    width="10"
                    height="19"
                    viewBox="0 0 10 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 19L0.669872 11.5H9.33013L5 19Z" fill="white" />
                    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="white" />
                  </svg>
                </span>
              </div>
            </TableHead>
            <TableHead className="w-1/4">
              <div className="flex items-center text-white">
                <span>Difficulty</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => sortByColumn("difficulty")}
                >
                  <svg
                    width="10"
                    height="19"
                    viewBox="0 0 10 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 19L0.669872 11.5H9.33013L5 19Z" fill="white" />
                    <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="white" />
                  </svg>
                </span>
              </div>
            </TableHead>
            <TableHead className="w-1/4 rounded-tr-lg text-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paddedData.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/4">{item.name || "\u00A0"}</TableCell>
              <TableCell className="w-1/4">
                {item.category || "\u00A0"}
              </TableCell>
              <TableCell className="w-1/4">
                {item.difficulty || "\u00A0"}
              </TableCell>
              <TableCell className="flex justify-evenly py-4">
                {item.name ? (
                  <>
                    <Button>View</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </>
                ) : (
                  <div className="invisible flex">
                    <Button>View</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
