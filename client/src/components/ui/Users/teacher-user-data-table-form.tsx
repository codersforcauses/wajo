import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { SelectSchool } from "@/components/ui/Users/select-school";
import { usePostMutation } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";
import { createTeacherSchema } from "@/types/user";

type Teacher = z.infer<typeof createTeacherSchema>;

/**
 * Renders a data table form for managing user information with a dynamic table structure.
 *
 * The `DataTableForm` component allows users to add, and delete rows of user data.
 * It uses `react-hook-form` with Zod schema validation to manage and validate the form state.
 * Each row includes fields for `Firstname`, `Lastname`, `Password`, `School` and `Year level`.
 *
 * @function DataTableForm
 *
 * @description
 * The component utilizes the following libraries and components:
 * - `react-hook-form` for form state management.
 * - `zod` for schema validation.
 *
 * Features:
 * - Dynamically adds or removes rows with user data.
 * - Provides validation for all input fields.
 * - Submits the collected data as an array of users.
 *
 * Additional Reference:
 * - {@link https://react-hook-form.com/docs/usefieldarray React Hook Form: useFieldArray}
 */
export function TeacherDataTableForm() {
  const router = useRouter();
  const { mutate: postTeachers, isPending } = usePostMutation<Teacher[]>(
    ["teachers", "users"],
    "/users/teachers/",
    20000,
  );

  const defaultTeacher: Teacher = {
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    phone: "",
    school_id: 0,
  };

  const createTeacherForm = useForm<{
    teachers: Teacher[];
  }>({
    resolver: zodResolver(z.object({ teachers: z.array(createTeacherSchema) })),
    defaultValues: { teachers: [defaultTeacher] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createTeacherForm.control,
    name: "teachers",
  });

  const onSubmit = (data: { teachers: Teacher[] }) => {
    console.log("Inside onSubmit");
    console.log("Submitting data:", data);
    data.teachers.forEach((teacher) => {
      postTeachers(teacher, {
        onSuccess: (response) => {
          // queryClient.invalidateQueries({ queryKey: ["users"] });
          toast.success("Teacher created successfully");
          console.log("Response:", response);
          router.push("/admin-dashboard/users/teachers");
        },
        onError: (error) => {
          toast.error("Failed to create teacher");
          console.error("Error creating teacher", error);
        },
      });
    });
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createTeacherForm}>
        <form
          id="create_user_form"
          onSubmit={createTeacherForm.handleSubmit(onSubmit)}
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
                {/* <TableHead className={commonTableHeadClasses}>
                  Username*
                </TableHead> */}
                <TableHead
                  className={cn(commonTableHeadClasses, "text-pretty", "w-1/5")}
                >
                  Password*
                  <FormDescription className="text-xs text-white">
                    Minimum 8 characters with letters, numbers, and symbols
                  </FormDescription>
                </TableHead>

                <TableHead className={commonTableHeadClasses}>
                  School*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>Email</TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Phone number
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
                      control={createTeacherForm.control}
                      name={`teachers.${index}.first_name`}
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
                      control={createTeacherForm.control}
                      name={`teachers.${index}.last_name`}
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
                  {/* Password Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeacherForm.control}
                      name={`teachers.${index}.password`}
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

                  {/* School Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeacherForm.control}
                      name={`teachers.${index}.school_id`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
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
                  </TableCell>

                  {/* Email Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeacherForm.control}
                      name={`teachers.${index}.email`}
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
                  {/* phone Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeacherForm.control}
                      name={`teachers.${index}.phone`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter phone number"
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
              onClick={() => append(defaultTeacher)}
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
