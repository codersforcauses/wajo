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
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePatchMutation } from "@/hooks/use-put-data";
import { Role, updateStaffSchema, User } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Edit />
    </ProtectedPage>
  );
}

type UpdateStaff = z.infer<typeof updateStaffSchema>;

function Edit() {
  const router = useRouter();
  const { userId } = useAuth();
  const staffId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<User>({
    queryKey: [`users.staffs.${staffId}`],
    endpoint: `/users/staffs/${staffId}/`,
    enabled: !isNaN(staffId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (staffId !== userId) return <div>Not valid to view the info</div>;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditUserForm user={data} />;
}

function EditUserForm({ user }: { user: User }) {
  const router = useRouter();

  const mutationKey = ["staff.update", `${user.id}`];
  const { mutate: updateStaff, isPending } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, [`users.staffs`]],
    endpoint: `/users/staffs/${user.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success(`Staff has been updated.`);
    },
  });

  const updateForm = useForm<UpdateStaff>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
  });

  const onSubmit = (data: UpdateStaff) => {
    updateStaff({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update Staff</h1>

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
