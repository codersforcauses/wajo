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
import { Textarea } from "@/components/ui/textarea";
import { SelectSchool } from "@/components/ui/Users/select-school";
import { cn } from "@/lib/utils";
import { createTeamSchema } from "@/types/team";

type Team = z.infer<typeof createTeamSchema>;

export default function TeamDataTableForm() {
  const defaultTeam = {
    name: "",
    description: "",
  } as Team;

  const createTeamForm = useForm<{
    teams: Team[];
  }>({
    resolver: zodResolver(z.object({ teams: z.array(createTeamSchema) })),
    defaultValues: { teams: [defaultTeam] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createTeamForm.control,
    name: "teams",
  });

  const onSubmit = (data: { teams: Team[] }) => {
    console.log("Submitted data:", data.teams);
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createTeamForm}>
        <form
          id="create_team_form"
          onSubmit={createTeamForm.handleSubmit(onSubmit)}
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
                <TableHead className={commonTableHeadClasses}>
                  Description*
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

                  {/* Name Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeamForm.control}
                      name={`teams.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter team name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Description Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createTeamForm.control}
                      name={`teams.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-10"
                              placeholder="Enter description"
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
                      control={createTeamForm.control}
                      name={`teams.${index}.school_id`}
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
              onClick={() => append(defaultTeam)}
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
