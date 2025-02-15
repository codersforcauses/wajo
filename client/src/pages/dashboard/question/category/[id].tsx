import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WaitingLoader } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePutMutation } from "@/hooks/use-put-data";
import { Category, createCategorySchema } from "@/types/question";

type UpdateCategory = z.infer<typeof createCategorySchema>;

export default function Edit() {
  const router = useRouter();
  const categoryId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Category>({
    queryKey: [`questions.categories.${categoryId}`],
    endpoint: `/questions/categories/${categoryId}/`,
    enabled: !isNaN(categoryId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditCategoryForm category={data} />;
}

function EditCategoryForm({ category }: { category: Category }) {
  const router = useRouter();

  const mutationKey = ["category_update", `${category.id}`];
  const { mutate: updateCategory, isPending } = usePutMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["questions.categories"]],
    endpoint: `/questions/categories/${category.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success("Category has been updated.");
    },
  });

  const updateForm = useForm<UpdateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      genre: category.genre,
      info: category.info,
    },
  });

  const onSubmit = (data: UpdateCategory) => {
    updateCategory({
      genre: data.genre,
      info: data.info,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update Category</h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          {/* Name */}
          <FormField
            control={updateForm.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input category name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Info */}
          <FormField
            control={updateForm.control}
            name={"info"}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>Info {requiredStar}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter info" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit">
              {isPending ? (
                <LoaderCircleIcon className="size-4 animate-spin text-primary" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
