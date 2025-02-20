import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/router";
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
import { useFetchData } from "@/hooks/use-fetch-data";
import api from "@/lib/api";
import { useTokenStore } from "@/store/token-store";
import { Team } from "@/types/team";
import { Student } from "@/types/user";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function TeamViewPage() {
  const router = useRouter();
  const { teamId } = router.query;
  const { data, isLoading, error } = useFetchData<Team>({
    queryKey: ["teams", teamId],
    endpoint: `/team/teams/${teamId}/`,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [initialStudentIds, setInitialStudentIds] = useState<number[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integrate zod validation
    defaultValues: {
      name: "",
      description: "",
    },
  });
  // Open modal
  const openModal = () => setIsModalOpen(true);
  //   const { access } = useTokenStore();
  //   const [schoolId, setSchoolId] = useState<number | undefined>(undefined);
  const handleStudentSelection = (students: Student[]) => {
    setSelectedStudents(students);
  };

  useEffect(() => {
    // if (access?.decoded) {
    //   const userSchoolId = access.decoded["school_id"];
    //   setSchoolId(userSchoolId);
    // }
    if (data?.members) {
      setSelectedStudents(data.members.map((member) => member.student));
      setInitialStudentIds(data.members.map((member) => member.student.id));
    }
    if (data) {
      form.reset({
        name: data.name,
        description: data.description,
      });
    }
  }, [data?.members, data, form.reset]);

  if (isLoading || !data || !data?.members) return <p>Loading...</p>;

  const teamData = {
    // school_id: schoolId,
    name: data.name,
    description: data.description,
  };
  const onSubmit = async (formData: FormValues) => {
    const editedTeamData = {
      ...formData,
    };

    console.log("Form Data:", editedTeamData);

    const differences: Partial<FormValues> = {};
    for (const key of Object.keys(teamData) as Array<keyof FormValues>) {
      if (teamData[key] !== editedTeamData[key]) {
        differences[key] = editedTeamData[key];
      }
    }
    console.log("differences:", differences);

    const selectedStudentIds = selectedStudents.map((student) => student.id);
    const removedStudentIds = initialStudentIds.filter(
      (id) => !selectedStudentIds.includes(id),
    );
    const addedStudentIds = selectedStudentIds.filter(
      (id) => !initialStudentIds.includes(id),
    );

    if (Object.keys(differences).length != 0) {
      try {
        const response: any = await api.patch(
          `/team/teams/${teamId}/`,
          differences,
        );
        console.log("Team updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating team:", error);
        return; // Stop execution if team creation fails
      }
    }
    const removedMemberIds = data.members.filter((member) =>
      removedStudentIds.includes(member.student.id),
    );

    try {
      const requests = removedMemberIds.map((id) => {
        return api.delete(`/team/team-members/${id}/`);
      });

      const responses = await Promise.all(requests); // Wait for all requests
      console.log("Deleting team member requests successful:", responses);
    } catch (error) {
      console.error("Error sending delete requests:", error);
    }
    try {
      const requests = addedStudentIds.map((id) => {
        return api.post("/team/team-members/", {
          student_id: id,
          team: teamId,
        });
      });

      const responses = await Promise.all(requests); // Wait for all requests
      console.log("All team member requests successful:", responses);
    } catch (error) {
      console.error("Error sending post requests:", error);
    }
    router.push("/team");
  };

  const teamStudents = data.members.map((member) => member.student.id);
  console.log("team members:", teamStudents);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">View or Edit a Team</h1>
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
                  <Input placeholder={data.name} {...field} />
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
                  <Textarea placeholder={data.description} {...field} />
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
                  <Image src="/Add-items.svg" alt={`Icon of Adding Items`} />{" "}
                  Select Team Members
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
                  <Image src="/Add-items.svg" alt={`Icon of Adding Items`} />{" "}
                  Select Team Members
                </Button>
              </div>
            )}

            <div className="flex justify-center">
              <Button type="submit" className="mt-4">
                Submit
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
        selectedIds={teamStudents}
      />
    </div>
  );
}
