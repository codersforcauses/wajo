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

// The shape of a single student returned from the backend
type CreatedStudent = {
  id: number;
  first_name: string;
  last_name: string;
  student_id: string;
  year_level: number | string;
  school: {
    id: number;
    name: string;
    // any other fields your backend returns...
  };
  attendent_year: number;
  created_at: string;
  extenstion_time: number;
};

// For localStorage and CSV export
type StoredRecord = {
  studentId: string;
  firstName: string;
  lastName: string;
  yearLevel: number | string;
  schoolId: number;
  schoolName: string;
  attendentYear: number;
  createdAt: string;
  extensionTime: number;
};
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
  // calculate the default year for the attendent_year field
  const currentYear = new Date().getFullYear();
  const defaultAttendentYear = Math.max(2024, Math.min(currentYear, 2050));

  const defaultUser: User = {
    first_name: "",
    last_name: "",
    password: "",
    year_level: "7", // default year_level is "7"
    school_id: 1, // default school_id is 1, need to be changed later
    attendent_year: defaultAttendentYear,
    // extenstion_time is optional, so it can be omitted
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

  // const onSubmit = (data: { users: User[] }) => {
  //   console.log("Submitted data:", data.users);
  // };

  /**
   * When form is submitted:
   * 1. POST the array of users to /api/users/students/
   * 2. Store the *response data* in localStorage
   */
  const onSubmit = async (data: { users: User[] }) => {
    try {
      // POST the array of user objects to your backend
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/students/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.users), // Send them as an array
        },
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // The backend should return an array of created student records:
      const createdStudents: CreatedStudent[] = await response.json();

      // Build newRecords in the shape you want to store in localStorage
      const newRecords: StoredRecord[] = createdStudents.map((std) => ({
        studentId: std.student_id,
        firstName: std.first_name,
        lastName: std.last_name,
        yearLevel: std.year_level,
        schoolId: std.school.id,
        schoolName: std.school.name,
        attendentYear: std.attendent_year,
        createdAt: std.created_at,
        extensionTime: std.extenstion_time,
      }));

      // Merge with any existing data in localStorage
      const previousData = JSON.parse(
        localStorage.getItem("studentRecords") || "[]",
      );
      const updatedData = [...previousData, ...newRecords];

      localStorage.setItem("studentRecords", JSON.stringify(updatedData));

      console.log("Submitted and saved to localStorage:", updatedData);
      alert("Students created successfully!");
    } catch (error: any) {
      console.error("Failed to create students:", error);
      alert("Something went wrong while creating students.");
    }
  };

  /**
   * Download a CSV file from the localStorage data.
   * We'll read from "studentRecords" and produce the requested columns:
   *   Student ID, First Name, Last Name, Year Level, School ID, School Name,
   *   Attendent Year, Created At, Extension Time
   */
  const downloadCSV = () => {
    const storedData: StoredRecord[] = JSON.parse(
      localStorage.getItem("studentRecords") || "[]",
    );

    if (storedData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // CSV headers in the order you want them
    const csvHeaders = [
      "Student ID",
      "First Name",
      "Last Name",
      "Year Level",
      "School ID",
      "School Name",
      "Attendent Year",
      "Created At",
      "Extension Time",
    ];

    // Build each row from storedData
    const csvRows = storedData.map((record) => [
      record.studentId,
      record.firstName,
      record.lastName,
      record.yearLevel,
      record.schoolId,
      record.schoolName,
      record.attendentYear,
      record.createdAt,
      record.extensionTime,
    ]);

    // Convert to CSV string
    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    // Trigger a download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "student_data.csv");
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
                  First Name*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Last Name*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Password*
                  <FormDescription className="text-xs text-white">
                    Minimum 8 characters with letters, numbers, and symbols
                  </FormDescription>
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Year Level*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  School*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Attendent Year*
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Extenstion Time
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
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
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
                      control={createUserForm.control}
                      name={`users.${index}.password`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <div className="relative flex items-center">
                              <Input
                                {...field}
                                placeholder="Enter password (or Auto Generate)"
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
                              onChange={(e) => field.onChange(e.target.value)}
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

                  {/* Attendent Year Field (2024-2050) */}
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

                  {/* Extenstion Time (optional) */}
                  <TableCell className="align-top">
                    <FormField
                      control={createUserForm.control}
                      name={`users.${index}.extenstion_time`}
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
