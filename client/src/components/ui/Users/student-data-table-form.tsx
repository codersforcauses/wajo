import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User } from "lucide-react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
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
import SelectYearLevel from "@/components/ui/Users/select-year";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  createUserSchema,
  Student as StudentType,
  User as UserType,
} from "@/types/user";

// type User = z.infer<typeof createUserSchema>;

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
export function StudentDataTableForm() {
  const defaultUser: StudentType = {
    id: 0,
    role: "student",
    first_name: "",
    last_name: "",
    // username: "",
    password: "",
    year_level: 7,
    attendent_year: new Date().getFullYear(),
    school_id: 0,
  };

  const createUserForm = useForm<{
    users: StudentType[];
  }>({
    resolver: zodResolver(z.object({ users: z.array(createUserSchema) })),
    defaultValues: { users: [defaultUser] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createUserForm.control,
    name: "users",
  });

  const onSubmit = (data: { users: StudentType[] }) => {
    console.log("Submitting data:", data.users);
    data.users.forEach((user) => {
      api
        .post(`/users/students/`, user)
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createUserForm}>
        <form
          id="create_user_form"
          onSubmit={createUserForm.handleSubmit(onSubmit)}
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
                <TableHead className={commonTableHeadClasses}>
                  Year level*
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
                      control={createUserForm.control}
                      name={`users.${index}.first_name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter firstname" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Lastname Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.last_name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter lastname" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Password Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.password`}
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

                  {/* Email Field
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell> */}

                  {/* School Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.school_id`}
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

                  {/* Year level Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.year_level`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <SelectYearLevel
                              selectedId={Number(field.value)}
                              onChange={field.onChange}
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
              onClick={() => append(defaultUser)}
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
