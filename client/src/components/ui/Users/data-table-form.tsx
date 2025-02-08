import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { SelectRole } from "@/components/ui/select-role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectSchool } from "@/components/ui/Users/select-school";
import { cn } from "@/lib/utils";
import { createRandomPwd, createUserSchema } from "@/types/user";

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
export function DataTableForm() {
  const defaultUser = {
    username: "",
    password: "",
    email: "",
  } as User;

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

  // const onSubmit = (data: { users: User[] }) => {
  //   console.log("Submitted data:", data.users);
  // };

  // new onsubmit function to save data to localStorage
  const onSubmit = (data: { users: User[] }) => {
    const previousData = JSON.parse(
      localStorage.getItem("userRecords") || "[]",
    );

    const perthTime = new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Perth",
    });

    const newRecords = data.users.map((user) => ({
      username: user.username,
      password: user.password,
      role: user.userRole,
      createdAt: perthTime,
    }));

    const updatedData = [...previousData, ...newRecords];

    // store in localStorage
    localStorage.setItem("userRecords", JSON.stringify(updatedData));

    console.log("Submitted and saved to localStorage:", updatedData);
  };

  // function to download data as CSV from localStorage
  const downloadCSV = () => {
    type UserRecord = {
      username: string;
      password: string;
      role: string;
      createdAt: string;
    };

    const storedData: UserRecord[] = JSON.parse(
      localStorage.getItem("userRecords") || "[]",
    );

    if (storedData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // generate CSV headers
    const csvHeaders = ["Username", "Password", "Role", "CreatedAt"];

    // generate CSV rows
    const csvRows = storedData.map((user: UserRecord) => [
      user.username,
      user.password,
      user.role,
      user.createdAt,
    ]);

    //  convert data to CSV format
    const csvContent = [csvHeaders, ...csvRows]
      .map((row: string[]) =>
        row.map((value: string) => `"${value}"`).join(","),
      ) // make sure values are enclosed in double quotes as strings
      .join("\n");

    //  create a Blob object with the CSV data and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <TableHead className={commonTableHeadClasses}>Email</TableHead>
                <TableHead className={commonTableHeadClasses}>
                  User Role*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  School*
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

                  {/* Username Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.username`}
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
                  {/* <TableCell className="align-top">
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
                  </TableCell> */}

                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.password`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <div className="relative flex items-center">
                              {/* input*/}
                              <Input
                                {...field}
                                placeholder="Enter password (or Auto Generate)"
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                className="ml-2"
                                // click event to generate random password and pass it to the input field
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

                  {/* Email Field */}
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
                  </TableCell>

                  {/* User Role Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.userRole`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <SelectRole
                              selectedRole={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={downloadCSV}
                title="Click to export the user create history from this browser as a CSV file"
              >
                Export CSV
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
