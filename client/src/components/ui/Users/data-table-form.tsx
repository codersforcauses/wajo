import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useTokenStore } from "@/store/token-store";
import { createRandomPwd, createUserSchema, Student } from "@/types/user";

type User = z.infer<typeof createUserSchema>;

/**
 * Renders a data table form for managing user information with a dynamic table structure.
 *
 * The `DataTableForm` component allows users to add, and delete rows of user data.
 * It uses `react-hook-form` with Zod schema validation to manage and validate the form state.
 * Each row includes fields for `Username`, `Password`, `Email`, `User Role`, and `School`.
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

interface DataTableFormProps {
  schoolID?: number;
}

export function DataTableForm(schoolID: DataTableFormProps) {
  // calculate the default year for the attendent_year field
  const currentYear = new Date().getFullYear();
  const defaultAttendentYear = Math.max(2024, Math.min(currentYear, 2050));

  const defaultUser: User = {
    first_name: "",
    last_name: "",
    password: "",
    year_level: "7", // default year_level is "7"
    school_id: schoolID?.schoolID ?? 0, // default school_id is 0
    attendent_year: defaultAttendentYear,
    // extension_time is optional, so it can be omitted
  };

  const createUserForm = useForm<{
    users: User[];
  }>({
    resolver: zodResolver(z.object({ users: z.array(createUserSchema) })),
    defaultValues: { users: [defaultUser] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createUserForm.control,
    name: "users",
  });

  const router = useRouter();
  const { mutate: createUser, isPending } = usePostMutation<Student[]>({
    mutationKey: ["students"],
    endpoint: "/users/students/",
    onSuccess: (response) => {
      console.log(response.data);

      toast.success("Students created successfully!");
      router.push("/dashboard/users/students/");
    },
  });

  const [role, setRole] = useState<string | undefined>(undefined);

  const { access } = useTokenStore(); // Access the JWT token

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
  }, [access]);

  const onSubmit = (data: { users: User[] }) => {
    createUser([...data.users]);
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
          <div className="grid">
            <div className="overflow-hidden rounded-lg border">
              <Table className="w-full border-collapse text-left shadow-md">
                <TableHeader className="bg-black text-lg font-semibold">
                  <TableRow className="hover:bg-muted/0">
                    <TableHead className={commonTableHeadClasses}>
                      No.
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      First Name*
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Last Name*
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Password*
                      <FormDescription className="text-pretty text-xs text-white">
                        Minimum 8 characters with letters, numbers, and symbols
                      </FormDescription>
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Year Level*
                    </TableHead>
                    {role?.toLowerCase() !== "teacher" && (
                      <TableHead className={commonTableHeadClasses}>
                        School*
                      </TableHead>
                    )}

                    <TableHead className={commonTableHeadClasses}>
                      Participation Year*
                    </TableHead>
                    {role?.toLowerCase() === "admin" && (
                      <TableHead className={commonTableHeadClasses}>
                        Extension Time
                      </TableHead>
                    )}
                    <TableHead
                      className={cn(
                        commonTableHeadClasses,
                        "sticky right-0 bg-black",
                      )}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow
                      key={field.id}
                      className="divide-gray-200 border-gray-50 text-sm text-black"
                    >
                      {/* No. Field */}
                      <TableCell className="text-lg font-semibold">
                        {index + 1}
                      </TableCell>

                      {/* First Name */}
                      <TableCell className="align-top">
                        <FormField
                          control={createUserForm.control}
                          name={`users.${index}.first_name`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormControl>
                                <Input
                                  {...field}
                                  className="w-full"
                                  placeholder="Enter first name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Last Name */}
                      <TableCell className="align-top">
                        <FormField
                          control={createUserForm.control}
                          name={`users.${index}.last_name`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter last name"
                                />
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
                                <div className="flex items-center">
                                  <Input
                                    {...field}
                                    placeholder="Enter password (or Auto Generate)"
                                    className="min-w-20"
                                  />
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="ml-2"
                                    onClick={() => {
                                      const randomPwd = createRandomPwd();
                                      field.onChange(randomPwd);
                                    }}
                                  >
                                    Auto
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Year Level Field (7/8/9) */}
                      <TableCell className="align-top">
                        <FormField
                          control={createUserForm.control}
                          name={`users.${index}.year_level`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-1.5">
                              <FormControl>
                                <select
                                  className="input rounded border p-2 hover:border-blue-400 focus:outline-none focus:ring-0"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                >
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* School Field */}
                      {role?.toLowerCase() !== "teacher" && (
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
                      )}

                      {/* Participation Year Field (2024-2050) */}
                      <TableCell className="align-top">
                        <FormField
                          control={createUserForm.control}
                          name={`users.${index}.attendent_year`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-1.5">
                              <FormControl>
                                <select
                                  className="input rounded border p-2 hover:border-blue-400 focus:outline-none focus:ring-0"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                >
                                  {Array.from({ length: 2050 - 2024 + 1 }).map(
                                    (_, i) => {
                                      const y = 2024 + i;
                                      return (
                                        <option key={y} value={y}>
                                          {y}
                                        </option>
                                      );
                                    },
                                  )}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Extension Time Field - Only for Admin */}
                      {role?.toLowerCase() === "admin" && ( // Check if the user is an admin
                        <TableCell className="align-top">
                          <FormField
                            control={createUserForm.control}
                            name={`users.${index}.extension_time`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="0"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      )}

                      {/* Delete Button */}
                      <TableCell className="sticky right-0 flex w-24 bg-white text-right align-top">
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
            </div>
          </div>

          <div className="flex justify-between px-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append(defaultUser)}
            >
              Add Row
            </Button>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
