import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchData } from "@/hooks/use-fetch-data";
import api from "@/lib/api";
import { useTokenStore } from "@/store/token-store";
import { Team, TeamDatagridProps } from "@/types/team";
import { School, Student } from "@/types/user";

export function TeamDatagrid({
  datacontext,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: TeamDatagridProps) {
  const router = useRouter();
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
                    <Button onClick={() => router.push(`/team/${item.id}`)}>
                      View
                    </Button>
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

interface StudentDatagridProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStudents: Student[]) => void;
  selectedIds?: number[];
}

export function StudentDatagrid({
  isOpen,
  onClose,
  onConfirm,
  selectedIds = [],
}: StudentDatagridProps) {
  const [selectedStudentIds, setSelectedStudentIds] =
    useState<number[]>(selectedIds);

  const { access } = useTokenStore(); // access the JWT token
  const [schoolId, setSchoolId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (access?.decoded) {
      const userSchoolId = access.decoded["school_id"];
      setSchoolId(userSchoolId);
    }
  }, [access]);

  const { data, isLoading, error } = useFetchData<{
    results: Student[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["students", currentPage, search],
    endpoint: "/users/students/",
    enabled: isOpen, // Only fetch when modal is open
    params: {
      page: currentPage,

      ...(search ? { search } : {}), // Only include search if not empty
    },
  });
  const pageSize = 5; // Adjust this if your backend uses a different page size
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  let filteredStudents: Student[] | undefined;
  if (schoolId != null) {
    filteredStudents =
      data?.results?.filter((student) => student.school.id === schoolId) || [];
  } else {
    filteredStudents = data?.results;
  }
  const toggleSelection = (studentId: number) => {
    setSelectedStudentIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(studentId)) {
        return prevSelectedIds.filter((id) => id !== studentId);
      } else {
        return [...prevSelectedIds, studentId];
      }
    });
  };

  // Confirm selection and close modal
  const handleConfirm = () => {
    const selectedStudents: Student[] = (data?.results ?? []).filter(
      (student) => selectedStudentIds.includes(student.id),
    );

    onConfirm(selectedStudents);
    onClose();
    console.log("Selected students:", selectedStudentIds);
  };

  const handleSearchSubmit = (value: string) => {
    console.log("Search input changed to: ", value);
    setSearch(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Team Members</DialogTitle>
        </DialogHeader>

        <SearchInput
          label=""
          value={search}
          placeholder="Search by name..."
          onSearch={handleSearchSubmit}
        />
        <Table className="w-full border-collapse text-left shadow-md">
          <TableHeader className="bg-black text-lg font-semibold">
            <TableRow className="hover:bg-muted/0">
              <TableHead className="w-1/5 rounded-tl-lg text-white">
                <span>Select</span>
              </TableHead>
              <TableHead className="w-1/5">
                <div className="flex items-center text-white">
                  <span>First Name</span>
                </div>
              </TableHead>
              <TableHead className="w-1/5">
                <div className="flex items-center text-white">
                  <span>Last Name</span>
                </div>
              </TableHead>

              <TableHead className="w-1/5 rounded-tr-lg text-white">
                <div className="flex items-center text-white">
                  <span>Student_id</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents?.map((student) => (
              <TableRow
                key={student.id}
                className={"divide-gray-200 border-gray-50 text-sm text-black"}
              >
                <TableCell className="w-1/5">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => toggleSelection(student.id)}
                  />
                </TableCell>
                <TableCell className="w-1/5">
                  {student.first_name || "\u00A0"}
                </TableCell>
                <TableCell className="w-1/5">
                  {student.last_name || "\u00A0"}
                </TableCell>

                <TableCell className="w-1/5">
                  {student.student_id || "\u00A0"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          className="mr-20 mt-5 flex justify-end"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
