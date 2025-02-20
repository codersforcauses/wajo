import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProtectedPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SelectSchoolType } from "@/components/ui/Users/select-school";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePutMutation } from "@/hooks/use-put-data";
import { createSchoolSchema, Role, School, SchoolType } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Edit />
    </ProtectedPage>
  );
}

type UpdateSchool = z.infer<typeof createSchoolSchema>;

function Edit() {
  const router = useRouter();
  const schoolId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<School>({
    queryKey: [`users.schools.${schoolId}`],
    endpoint: `/users/schools/${schoolId}/`,
    enabled: !isNaN(schoolId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditSchoolForm school={data} />;
}

function EditSchoolForm({ school }: { school: School }) {
  const router = useRouter();

  const mutationKey = ["school_update", `${school.id}`];
  const { mutate: updateSchool, isPending } = usePutMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["users.schools"]],
    endpoint: `/users/schools/${school.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success("School has been updated.");
    },
  });

  const updateForm = useForm<UpdateSchool>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: school.name,
      type: school.type as SchoolType,
      is_country: school.is_country,
      abbreviation: school.abbreviation,
    },
  });

  const onSubmit = (data: UpdateSchool) => {
    updateSchool({
      name: data.name,
      type: data.type,
      is_country: data.is_country,
      abbreviation: data.abbreviation,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update School</h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          {/* Name */}
          <FormField
            control={updateForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input school name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Type */}
          <FormField
            control={updateForm.control}
            name={"type"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type {requiredStar}</FormLabel>
                <FormControl>
                  <SelectSchoolType
                    selectedType={
                      typeof field.value === "string" &&
                      field.value.length === 0
                        ? field.value
                        : "Public"
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Is Country */}
          <FormField
            control={updateForm.control}
            name="is_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Country</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{field.value ? "Yes" : "No"}</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Abbreviation */}
          <FormField
            control={updateForm.control}
            name={"abbreviation"}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>Abbreviation {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input abbreviation" />
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
