import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StudentDatagrid } from "@/components/ui/Team/data-grid";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useTokenStore } from "@/store/token-store";
import { Student } from "@/types/user";

import AddItems from "../../../public/Add-items.svg";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function TeamCreatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integrate zod validation
    defaultValues: {
      name: "",
      description: "",
    },
  });
  // Open modal
  const openModal = () => setIsModalOpen(true);
  const { access } = useTokenStore(); // access the JWT token
  const [schoolId, setSchoolId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (access?.decoded) {
      const userSchoolId = access.decoded["school_id"];
      setSchoolId(userSchoolId);
    }
  }, [access]);
  // Handle student selection
  const handleStudentSelection = (students: Student[]) => {
    setSelectedStudents(students);
    console.log("selected students:", selectedStudents);
  };

  const onSubmit = async (data: FormValues) => {
    const teamData = {
      school_id: schoolId,
      //   school_id: 1, // to test(for admin which school_id is null)
      ...data,
    };

    console.log("Form Data:", teamData);

    let teamId: number | null = null; // Declare teamId outside

    try {
      const response: any = await api.post("/team/teams/", teamData);
      console.log("First response:", response);

      teamId = response.data.id; // Ensure response structure is correct
    } catch (error) {
      console.error("Error creating team:", error);
      return; // Stop execution if team creation fails
    }

    // Ensure teamId exists before making the second request
    if (!teamId) {
      console.error("Failed to retrieve team ID.");
      return;
    }

    try {
      const requests = selectedStudents.map((student) => {
        return api.post("/team/team-members/", {
          student_id: student.id,
          team: teamId,
        });
      });

      const responses = await Promise.all(requests); // Wait for all requests
      console.log("All team member requests successful:", responses);
    } catch (error) {
      console.error("Error sending post requests:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Create a Team</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Name */}
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Team Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Please input team name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question */}
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Competition Period <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="2024 Grade 7" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            {selectedStudents.length > 0 ? (
              <div className="mt-4 rounded-lg border border-dashed p-4">
                <Button
                  type="button"
                  onClick={openModal}
                  className="mb-4 w-min"
                >
                  <Image src={AddItems} alt={`Icon of Adding Items`} /> Select
                  Team Members
                </Button>
                <h2 className="text-lg font-semibold">Selected Members:</h2>
                <ul className="ml-6 list-disc">
                  {selectedStudents.map((student) => (
                    <li key={student.id}>{student.student_id}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex justify-center rounded-lg border border-dashed border-input">
                <Button type="button" onClick={openModal} className="my-8">
                  <Image src={AddItems} alt={`Icon of Adding Items`} /> Select
                  Team Members
                </Button>
              </div>
            )}

            <div className="flex justify-center">
              <Button type="submit" className="mt-4">
                Submit Team
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Student Selection Modal */}
      <StudentDatagrid
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStudentSelection}
      />
    </div>
  );
}
