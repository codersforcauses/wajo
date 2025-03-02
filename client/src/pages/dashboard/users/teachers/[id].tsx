import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
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
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePatchMutation } from "@/hooks/use-put-data";
import { Role, Teacher, updateTeacherSchema } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Edit />
    </ProtectedPage>
  );
}

type UpdateTeacher = z.infer<typeof updateTeacherSchema>;

function Edit() {
  const { userId, userRole } = useAuth();

  const router = useRouter();
  const teacherId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Teacher>({
    queryKey: [`users.teachers.${teacherId}`],
    endpoint: `/users/teachers/${teacherId}/`,
    enabled: !isNaN(teacherId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (userRole === Role.TEACHER && userId !== teacherId)
    return <div>Not valid to view the info</div>;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditUserForm user={data} />;
}

function EditUserForm({ user }: { user: Teacher }) {
  const router = useRouter();

  const mutationKey = ["teacher.update", `${user.id}`];
  const { mutate: updateTeacher, isPending } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, [`users.teachers`]],
    endpoint: `/users/teachers/${user.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success(`Teacher has been updated.`);
    },
  });

  const updateForm = useForm<UpdateTeacher>({
    resolver: zodResolver(updateTeacherSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      school_id: user.school?.id,
      phone: user.phone,
    },
  });

  const onSubmit = (data: UpdateTeacher) => {
    updateTeacher({
      first_name: data.first_name,
      last_name: data.last_name,
      school_id: data.school_id,
      phone: data.phone,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update Teacher</h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          {/* First Name */}
          <FormField
            control={updateForm.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input first name" />
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
                  <Input {...field} placeholder="Please input last name" />
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
          {/* Email */}
          <FormField
            control={updateForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phone */}
          <FormField
            control={updateForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input phone" />
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
