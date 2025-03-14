import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProtectedPage } from "@/components/layout";
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
import { useTokenStore } from "@/store/token-store";
import { Role, Student, updateStudentSchema } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Edit />
    </ProtectedPage>
  );
}

type UpdateStudent = z.infer<typeof updateStudentSchema>;

function Edit() {
  const router = useRouter();
  const studentId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Student>({
    queryKey: [`users.students.${studentId}`],
    endpoint: `/users/students/${studentId}/`,
    enabled: !isNaN(studentId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditUserForm user={data} />;
}

function EditUserForm({ user }: { user: Student }) {
  const router = useRouter();

  const mutationKey = ["student.update", `${user.id}`];
  const { mutate: updateStudent, isPending } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, [`users.students`]],
    endpoint: `/users/students/${user.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success(`Student has been updated.`);
    },
  });

  const updateForm = useForm<UpdateStudent>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      year_level: user.year_level,
      school_id: user.school?.id,
      attendent_year: user.attendent_year,
      extension_time: user.extension_time ? user.extension_time : 0,
    },
  });

  const { access } = useTokenStore(); // access the JWT token

  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
  }, [access]);

  const onSubmit = (data: UpdateStudent) => {
    updateStudent(data);
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
          {/* Participation Year */}
          <FormField
            control={updateForm.control}
            name="attendent_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of participation{requiredStar}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Please input year of participation"
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    } // Convert to number
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* role check for teacher or admin, teachers shouldnt be able to give extension time */}

          {/* Extension Time */}
          {role?.toLowerCase() === "admin" && (
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
                      placeholder="Please input extension time"
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      } // Convert to number
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
