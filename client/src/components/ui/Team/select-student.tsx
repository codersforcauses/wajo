import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/use-fetch-data";
import api from "@/lib/api";
import { School } from "@/types/user";

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  school: School;
  student_id: string;
}

interface SelectStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStudents: Student[]) => void;
}

export const SelectStudentsModal: React.FC<SelectStudentsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  //   const [schoolId, setSchoolId] = useState<number | null>(null);

  const token = localStorage.getItem("auth-tokens");
  let schoolId: any;
  if (token) {
    try {
      const ParsedToken = JSON.parse(token);
      console.log(ParsedToken);
      schoolId = ParsedToken?.state?.access?.decoded?.school_id;
      console.log("school Id is:", schoolId);
    } catch (error) {
      console.error("Error parsing auth-tokens:", error);
    }
  }
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const { data, isLoading, error } = useFetchData<{
    results: Student[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["students"],
    endpoint: "/users/students/",
    enabled: isOpen, // Only fetch when modal is open
  });
  let filteredStudents: Student[] | undefined;
  if (schoolId != null) {
    filteredStudents =
      data?.results?.filter((student) => student.school.id === schoolId) || [];
  } else {
    filteredStudents = data?.results;
  }

  // Toggle student selection
  const toggleSelection = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  // Confirm selection and close modal
  const handleConfirm = () => {
    const selectedStudents: Student[] = (data?.results ?? []).filter(
      (student) => selectedStudentIds.includes(student.id),
    );

    onConfirm(selectedStudents);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Team Members</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden rounded-lg border">
          {/* Scrollable Wrapper */}
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Select</th>
                  <th className="p-2 text-left">First Name</th>
                  <th className="p-2 text-left">Last Name</th>
                  <th className="p-2 text-left">student_id</th>
                </tr>
              </thead>

              {/* Table Body (Keeps Default Behavior) */}
              <tbody>
                {filteredStudents?.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => toggleSelection(student.id)}
                      />
                    </td>
                    <td className="p-2">{student.first_name}</td>
                    <td className="p-2">{student.last_name}</td>
                    <td className="p-2">{student.student_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
