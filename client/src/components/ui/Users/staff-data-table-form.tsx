import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePostMutation } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";
import { createStaffSchema } from "@/types/user";

type Staff = z.infer<typeof createStaffSchema>;

/**
 * Renders a data table form for managing staff information with a dynamic table structure.
 *
 * The `StaffDataTableForm` component allows users to add, and delete rows of staff data.
 * It uses `react-hook-form` with Zod schema validation to manage and validate the form state.
 * Each row includes fields for `Firstname`, `Lastname`, `Password`, `School` and `Year level`.
 *
 * @function StaffDataTableForm
 *
 * @description
 * The component utilizes the following libraries and components:
 * - `react-hook-form` for form state management.
 * - `zod` for schema validation.
 *
 * Features:
 * - Dynamically adds or removes rows with staff data.
 * - Provides validation for all input fields.
 * - Submits the collected data as an array of staffs.
 *
 * Additional Reference:
 * - {@link https://react-hook-form.com/docs/usefieldarray React Hook Form: useFieldArray}
 */
export function StaffDataTableForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: postStaffs, isPending } = usePostMutation<Staff[]>({
    mutationKey: ["staffs", "users"],
    endpoint: "/users/staffs/",
  });

  const defaultStaff = {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    is_superuser: true,
    email: "",
    is_staff: true,
  } as Staff;

  const createStaffForm = useForm<{
    staffs: Staff[];
  }>({
    resolver: zodResolver(z.object({ staffs: z.array(createStaffSchema) })),
    defaultValues: { staffs: [defaultStaff] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createStaffForm.control,
    name: "staffs",
  });

  const onSubmit = async (data: { staffs: Staff[] }) => {
    console.log("inside onSubmit", data);
    await data.staffs.forEach((staff) => {
      postStaffs(staff, {
        onSuccess: (response) => {
          toast.success("Staff created successfully");
          console.log("Response:", response);
        },
        onError: (error) => {
          toast.error("Failed to create staff");
          console.error("Error creating staff", error);
        },
      });
    });
    router.push("/dashboard/users/staffs");
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createStaffForm}>
        <form
          id="create_user_form"
          onSubmit={createStaffForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Table className="w-full border-collapse text-left shadow-md">
            <TableHeader className="bg-black text-lg font-semibold">
              <TableRow className="hover:bg-muted/0">
                <TableHead
                  className={cn(commonTableHeadClasses, "rounded-tl-lg", "w-0")}
                >
                  No.
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Firstname*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Lastname*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Username*
                </TableHead>
                <TableHead
                  className={cn(commonTableHeadClasses, "text-pretty", "w-1/5")}
                >
                  Password*
                  <FormDescription className="text-xs text-white">
                    Minimum 8 characters with letters, numbers, and symbols
                  </FormDescription>
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  IsSuperUser?*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>Email?</TableHead>
                <TableHead className={commonTableHeadClasses}>
                  IsStaff?*
                </TableHead>
                <TableHead
                  className={cn(commonTableHeadClasses, "rounded-tr-lg", "w-0")}
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow
                  key={field.id}
                  className={
                    "divide-gray-200 border-gray-50 text-sm text-black"
                  }
                >
                  {/* No. Field */}
                  <TableCell className="text-lg font-semibold">
                    {index + 1}
                  </TableCell>

                  {/* Firstname Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.first_name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter first_name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Lastname Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.last_name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Username Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.username`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Password Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.password`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* IsSuperUser Field */}
                  <TableCell className="align-center">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.is_superuser`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center justify-center gap-1.5 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Email Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* IsStaff Field */}
                  <TableCell className="align-center">
                    <FormField
                      control={createStaffForm.control}
                      name={`staffs.${index}.is_staff`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center justify-center gap-1.5 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell className="w-24 text-right align-top">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between px-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append(defaultStaff)}
            >
              Add Row
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
