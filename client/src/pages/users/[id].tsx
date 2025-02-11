import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WaitingLoader } from "@/components/ui/loading";
import { SelectSchool } from "@/components/ui/Users/select-school";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePatchMutation } from "@/hooks/use-put-data";
import { Student, updateStudentSchema } from "@/types/user";

type UpdateStudent = z.infer<typeof updateStudentSchema>;

export default function Edit() {
  const router = useRouter();
  const studentId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Student>({
    queryKey: [`users.students.${studentId}`],
    endpoint: `/users/students/${studentId}/`,
    enabled: !isNaN(studentId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditStudentForm student={data} />;
}

function EditStudentForm({ student }: { student: Student }) {
  const router = useRouter();

  const mutationKey = ["student.update", `${student.id}`];
  const { mutate: updateStudent, isPending } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["users.students"]],
    endpoint: `/users/students/${student.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success("Student has been updated.");
    },
  });

  const updateForm = useForm<UpdateStudent>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      first_name: student.first_name,
      last_name: student.last_name,
      year_level: student.year_level,
      school_id: student.school.id,
      attendent_year: student.attendent_year,
      extension_time: student.extenstion_time,
    },
  });

  const onSubmit = (data: UpdateStudent) => {
    updateStudent({
      first_name: data.first_name,
      last_name: data.last_name,
      year_level: data.year_level,
      school_id: data.school_id,
      attendent_year: data.attendent_year,
      extenstion_time: data.extension_time,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update Student</h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          {/* First Name */}
          <FormField
            control={updateForm.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Please input student first name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Last Name */}
          <FormField
            control={updateForm.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Please input student last name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* School */}
          <FormField
            control={updateForm.control}
            name={"school_id"}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>School {requiredStar}</FormLabel>
                <FormControl>
                  <SelectSchool
                    selectedId={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Year Level */}
          <FormField
            control={updateForm.control}
            name="year_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Level {requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Please input year level"
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    } // Convert to number
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Attendent Year */}
          <FormField
            control={updateForm.control}
            name="attendent_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attendent Year {requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Please input attendent year"
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    } // Convert to number
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Extension Time */}
          <FormField
            control={updateForm.control}
            name="extension_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extension Time {requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Please input extention time"
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    } // Convert to number
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit">
              {isPending ? (
                <LoaderCircleIcon className="size-4 animate-spin text-primary" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
