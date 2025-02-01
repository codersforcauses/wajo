import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Team, TeamDatagridProps } from "@/types/team";

import { Button } from "../button";
import { Pagination } from "../pagination";

export function TeamDatagrid({
  datacontext,
  onSort,
  sortField,
  sortOrder,
  currentPage,
  totalPages,
  onPageChange,
}: TeamDatagridProps) {
  const deleteTeam = async (id: number) => {
    try {
      const response = await api.delete(`/team/teams/${id}/`);
      console.log("Deleted successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };
  return (
    <div>
      <Table className="w-full border-collapse text-left shadow-md">
        <TableHeader className="bg-black text-lg font-semibold">
          <TableRow className="hover:bg-muted/0">
            <TableHead className="w-1/5 rounded-tl-lg text-white">
              <span>Team ID</span>
            </TableHead>
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>Name</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => onSort("name")}
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
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>Student Name</span>
              </div>
            </TableHead>
            <TableHead className="w-1/5">
              <div className="flex items-center text-white">
                <span>School Name</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => onSort("school")}
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
            <TableHead className="w-1/5 rounded-tr-lg text-white">
              <div className="flex items-center text-white">
                <span>Competition Period</span>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => onSort("description")}
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {datacontext.map((item, index) => (
            <TableRow
              key={index}
              className={"divide-gray-200 border-gray-50 text-sm text-black"}
            >
              <TableCell className="w-1/5">{item.id || "\u00A0"}</TableCell>
              <TableCell className="w-1/5">{item.name || "\u00A0"}</TableCell>
              <TableCell className="w-1/5">
                {item?.members
                  ?.map((member) => member.studentName)
                  .join(", ") || "\u00A0"}
              </TableCell>
              <TableCell className="w-1/5">
                {item.school?.name || "\u00A0"}
              </TableCell>
              <TableCell className="w-1/5">
                {item.description || "\u00A0"}
              </TableCell>
              <TableCell className="flex justify-evenly py-4">
                {item.id ? (
                  <>
                    <Button>View</Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteTeam(item.id)}
                    >
                      Delete
                    </Button>
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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
        className="mr-20 mt-5 flex justify-end"
      />
    </div>
  );
}
