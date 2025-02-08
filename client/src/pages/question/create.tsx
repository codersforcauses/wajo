import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ChangeEvent, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PreviewModal from "@/components/ui/Question/preview-modal";
import { MultipleSelectCategory } from "@/components/ui/Question/select-category";
import { Textarea } from "@/components/ui/textarea";
import { usePostMutation } from "@/hooks/use-post-data";
import { createQuestionSchema, Question } from "@/types/question";

type FormValues = z.infer<typeof createQuestionSchema>;

export default function Create() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(createQuestionSchema), // Integrate zod validation
    defaultValues: {
      questionName: "",
      question: "",
      answer: "",
      solution_text: "",
      mark: "",
      difficulty: "",
      genre: [],
    },
  });

  const watchedValues = useWatch<FormValues>({
    control: form.control,
  });

  const { mutate: createQuestion, isPending: isCreatePending } =
    usePostMutation<Question>(["question"], "/questions/question-bank/", 1000, {
      onSuccess: () => {
        toast.success("Question created successfully!");
        router.push("/question/");
      },
    });

  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  }

  const handleSubmit = (data: FormValues) => {
    createQuestion({
      name: data.questionName,
      category_ids: data.genre.map((g) => parseInt(g.value)),
      is_comp: false,
      answers: data.answer.split(",").map((num) => Number(num.trim())), // list of numbers
      question_text: data.question,
      note: "note",
      answer_text: data.solution_text,
      diff_level: parseInt(data.difficulty),
      layout: "layout",
      mark: parseInt(data.mark, 0),
      image: null,
    });
  };

  return (
    <div className="mx-auto my-4 max-w-3xl rounded-lg bg-gray-50 p-4 shadow-lg">
      <h1 className="mb-6 text-center text-xl font-bold">Create Question</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Question Name */}
          <FormField
            name="questionName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="questionName">
                  Question Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="questionName"
                    placeholder="Please input question name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question */}
          <FormField
            name="question"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="question">
                  Question <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="question"
                    placeholder="Please input question detail"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Answer */}
          <FormField
            name="answer"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="answer">
                  Answer <span className="text-red-500">*</span>
                </FormLabel>
                <FormDescription>
                  Must be an integer from 0-999, use “,” to separate multiple
                  answers
                </FormDescription>
                <FormControl>
                  <Input
                    id="answer"
                    placeholder="Please input answer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Solution */}
          <FormField
            name="solution_text"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="solution_text">Solution</FormLabel>
                <FormControl>
                  <Textarea
                    id="solution_text"
                    placeholder="Please input solution"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mark */}
          <FormField
            name="mark"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="mark">
                  Mark <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="mark"
                    placeholder="Please input marks to this question"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
          <FormField
            name="difficulty"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="difficulty">
                  Difficulty <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="difficulty"
                    type="text"
                    placeholder="Please input a value from 1 to 10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <div className="flex gap-10">
            {/* Genre */}
            <FormField
              name="genre"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <MultipleSelectCategory
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex min-h-[325px] flex-1 flex-col gap-3 rounded-lg border-2 border-[#7D916F] p-5">
            <label
              htmlFor="imageInput"
              className="flex items-center gap-2 text-lg"
            >
              Upload Image <ImageIcon />
            </label>

            <input
              id="imageInput"
              type="file"
              onChange={onImageChange}
              className="block w-full text-sm text-slate-500 file:ml-0 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#7D916F] hover:cursor-pointer hover:file:bg-violet-100"
              accept="image/jpeg, image/png, image/jpg, image/gif"
            />

            <div className="flex flex-1 items-center justify-center">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Question Image"
                  width="0"
                  height="0"
                  className="h-auto w-full"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <PreviewModal
              dataContext={{
                questionName: watchedValues.questionName || "",
                question: watchedValues.question || "",
                answer: watchedValues.answer || "",
                solution: watchedValues.solution_text || "",
                mark: watchedValues.mark || "",
              }}
            >
              <Button type="button" variant={"ghost"} className="bg-gray-200">
                Preview
              </Button>
            </PreviewModal>

            <Button
              type="submit"
              variant={"outline"}
              disabled={isCreatePending}
              onClick={() => {
                handleSubmit;
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
