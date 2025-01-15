import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { cn } from "@/lib/utils";
import { createSchoolSchema } from "@/types/school";

type School = z.infer<typeof createSchoolSchema>;

/**
 * Renders a data table form for managing school information with dynamic rows.
 *
 * @function SchoolDataTableForm
 *
 * @description
 * This component provides a table-based form for managing schools. Users can add, remove, and edit school entries dynamically.
 *
 * Similar Implementation:
 * @see [UserDataTableForm](./data-table-form.tsx) for reference.
 */
export function SchoolDataTableForm() {
  const defaultSchool = {
    name: "",
  } as School;

  const createSchoolForm = useForm<{
    schools: School[];
  }>({
    resolver: zodResolver(z.object({ schools: z.array(createSchoolSchema) })),
    defaultValues: { schools: [defaultSchool] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createSchoolForm.control,
    name: "schools",
  });

  const onSubmit = (data: { schools: School[] }) => {
    console.log("Submitted data:", data.schools);
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createSchoolForm}>
        <form
          id="create_school_form"
          onSubmit={createSchoolForm.handleSubmit(onSubmit)}
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
                <TableHead className={commonTableHeadClasses}>Name*</TableHead>
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
                  <TableCell className="text-lg font-semibold">
                    {index + 1}
                  </TableCell>
                  <TableCell className="align-top">
                    <FormField
                      control={createSchoolForm.control}
                      name={`schools.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter School Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
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
              onClick={() => append(defaultSchool)}
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
