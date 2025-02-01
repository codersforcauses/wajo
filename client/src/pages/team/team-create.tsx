import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  SelectStudentsModal,
  Student,
} from "@/components/ui/Team/select-student";
import api from "@/lib/api";

export default function TeamManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Open modal
  const openModal = () => setIsModalOpen(true);

  // Handle student selection
  const handleStudentSelection = (students: Student[]) => {
    // setSelectedStudents(students);
  };

  // Submit team to backend
  const handleSubmit = async () => {
    // const teamData = {
    //   teamName: "My Team", // Replace with actual team name input
    //   members: selectedStudents.map((student) => student.id),
    // };
    // try {
    //   await api.post("/team/teams", teamData);
    //   alert("Team created successfully!");
    // } catch (error) {
    //   console.error("Error creating team:", error);
    // }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create a Team</h1>

      <Button onClick={openModal} className="mt-4">
        Select Team Members
      </Button>

      {/* Display Selected Students */}
      {selectedStudents.length > 0 && (
        <div className="mt-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Selected Members:</h2>
          <ul className="ml-6 list-disc">
            {selectedStudents.map((student) => (
              <li key={student.id}>{student.first_name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="mt-4">
        Submit Team
      </Button>

      {/* Student Selection Modal */}
      <SelectStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStudentSelection}
      />
    </div>
  );
}
