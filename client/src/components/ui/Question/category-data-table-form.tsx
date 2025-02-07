import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { usePostMutation } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";
import { createCategorySchema } from "@/types/question";

type Category = z.infer<typeof createCategorySchema>;

export function CategoryDataTableForm() {
  const defaultCategory = {
    genre: "",
    info: "",
  } as Category;

  const createCategoryForm = useForm<{
    categories: Category[];
  }>({
    resolver: zodResolver(
      z.object({ categories: z.array(createCategorySchema) }),
    ),
    defaultValues: { categories: [defaultCategory] },
  });

  const { fields, append, remove } = useFieldArray({
    control: createCategoryForm.control,
    name: "categories",
  });

  const router = useRouter();
  const { mutate: createTeam, isPending } = usePostMutation<Category[]>(
    ["categories"],
    "/questions/categories/",
    1000,
    {
      onSuccess: () => {
        toast.success("Teams created successfully!");
        router.push("/question/category/");
      },
    },
  );

  const onSubmit = (data: { categories: Category[] }) => {
    createTeam([...data.categories]);
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="space-y-4 p-4">
      <Form {...createCategoryForm}>
        <form
          id="create_category_form"
          onSubmit={createCategoryForm.handleSubmit(onSubmit)}
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
                <TableHead className={commonTableHeadClasses}>Genre*</TableHead>
                <TableHead className={commonTableHeadClasses}>Info*</TableHead>
                <TableHead
                  className={cn(commonTableHeadClasses, "rounded-tr-lg", "w-0")}
                />
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

                  {/* Genre */}
                  <TableCell className="align-top">
                    <FormField
                      control={createCategoryForm.control}
                      name={`categories.${index}.genre`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Input {...field} placeholder="Enter genre" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* Description Field */}
                  <TableCell className="align-top">
                    <FormField
                      control={createCategoryForm.control}
                      name={`categories.${index}.info`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-10"
                              placeholder="Enter info"
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
              onClick={() => append(defaultCategory)}
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
