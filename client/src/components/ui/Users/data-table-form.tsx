import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";
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
import { createRandomPwd, createUserSchema, Student } from "@/types/user";

// For localStorage and CSV export
type StoredRecord = {
  studentId: string;
  firstName: string;
  lastName: string;
  yearLevel: number | string;
  schoolId: number;
  schoolName: string;
  attendentYear: number;
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
    school_id: 0,
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

  const { mutate: createUser, isPending } = usePostMutation<Student[]>({
    mutationKey: ["students"],
    endpoint: "/users/students/",
    onSuccess: (res) => {
      console.log(res.data);

      toast.success("Students created successfully!");
      try {
        // Build newRecords in the shape you want to store in localStorage
        const newRecords: StoredRecord[] = res.data.map((std) => ({
          studentId: std.student_id,
          firstName: std.first_name,
          lastName: std.last_name,
          yearLevel: std.year_level,
          schoolId: std.school.id,
          schoolName: std.school.name,
          attendentYear: std.attendent_year,
          extensionTime: std.extenstion_time || 0,
        }));

        // Merge with any existing data in localStorage
        const previousData = JSON.parse(
          localStorage.getItem("studentRecords") || "[]",
        );
        const updatedData = [...previousData, ...newRecords];

        localStorage.setItem("studentRecords", JSON.stringify(updatedData));
        toast.success(
          "You can click Export CSV button to download the historical user creation data.",
        );
      } catch (error) {
        toast.error(`Error when update data for Export CSV. ${error}`);
      }
    },
  });

  const onSubmit = (data: { users: User[] }) => {
    createUser([...data.users]);
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
      toast.warning("No data available to export.");
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
    link.setAttribute("download", "Student_Create_Data.csv");
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
              <ClearHistoryModal>
                <Button type="button" variant={"destructive"}>
                  Clear History
                </Button>
              </ClearHistoryModal>

              <Button
                type="button"
                variant="outline"
                onClick={downloadCSV}
                title="Click to export the user create history from this browser as a CSV file"
              >
                Export CSV
              </Button>

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

function ClearHistoryModal({ children }: { children: ReactNode }) {
  const onClearHistory = () => {
    localStorage.removeItem("studentRecords");
    toast.success("Creation history cleared from this browser.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-auto w-[95%] max-w-[400px] flex-col items-center rounded-lg bg-[--nav-background] p-6 shadow-xl">
        <VisuallyHidden.Root>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden.Root>

        <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />

        <div className="text-center text-gray-900">
          <p className="text-2xl font-semibold">
            Are you sure you want to clear all creation history in this browser?
          </p>
          <p className="text-md mt-1 text-gray-500">
            This cannot be undone. We recommend exporting the data first.
          </p>
        </div>

        <div className="mt-6 flex gap-10">
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-36 border border-black bg-white"
            >
              No
            </Button>
          </DialogTrigger>
          <Button
            onClick={onClearHistory}
            variant={"secondary"}
            className="w-36"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
