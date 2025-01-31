import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectSchoolType } from "@/components/ui/Users/select-school";
import { usePostMutation } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";
import { createSchoolSchema } from "@/types/user";

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
    is_country: true,
    abbreviation: "",
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

  const router = useRouter();
  const { mutate: createSchool, isPending } = usePostMutation<School[]>(
    ["schools"],
    "/users/schools/",
    1000,
    {
      onSuccess: () => {
        toast.success("Schools created successfully!");
        router.push("/users/school/");
      },
    },
  );

  const onSubmit = (data: { schools: School[] }) => {
    createSchool({ ...data.schools });
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
                <TableHead className={commonTableHeadClasses}>Type*</TableHead>
                <TableHead
                  className={cn(commonTableHeadClasses, "text-center")}
                >
                  Is Country
                </TableHead>
                <TableHead className={commonTableHeadClasses}>
                  Abbreviation*
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
                  <TableCell className="align-top">
                    <FormField
                      control={createSchoolForm.control}
                      name={`schools.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <SelectSchoolType
                              selectedType={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="px-0 pt-6 align-top">
                    <FormField
                      control={createSchoolForm.control}
                      name={`schools.${index}.is_country`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-center space-x-2">
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
                  </TableCell>
                  <TableCell className="align-top">
                    <FormField
                      control={createSchoolForm.control}
                      name={`schools.${index}.abbreviation`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter Abbreviation"
                            />
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
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
