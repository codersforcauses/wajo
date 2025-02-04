import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import DashboardLayout from "@/components/dashboard-layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NextPageWithLayout } from "@/pages/_app";

// Define the Zod schema for validation
const formSchema = z.object({
  questionName: z.string().min(1, "Question Name is required"),
  question: z.string().min(1, "Question is required"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .refine(
      (val) =>
        val
          .split(",")
          .every(
            (num) =>
              /^\d+$/.test(num.trim()) &&
              +num.trim() >= 0 &&
              +num.trim() <= 999,
          ),
      {
        message:
          "Must be an integer from 0-999, use “,” to separate multiple answers",
      },
    ),
  solution: z.string().optional(),
  mark: z
    .string()
    .min(1, "Mark is required")
    .regex(/^\d+$/, "Mark must be a number"),
  difficulty: z.string().min(1, "Difficulty is required"),
  genre: z.string().min(1, "Genre is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePage: NextPageWithLayout = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integrate zod validation
    defaultValues: {
      questionName: "",
      question: "",
      answer: "",
      solution: "",
      mark: "",
      difficulty: "",
      genre: "",
    },
  });

  const watchedValues = useWatch<FormValues>({
    control: form.control,
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    alert(JSON.stringify(data, null, 2));
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
            name="solution"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="solution">Solution</FormLabel>
                <FormControl>
                  <Textarea
                    id="solution"
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

          {/* Difficulty and Genre */}
          <div className="flex gap-10">
            {/* Difficulty */}
            <FormField
              name="difficulty"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="difficulty-select">
                    Difficulty <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="difficulty-select"
                        className="bg-yellow-400 w-24"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-24">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genre */}
            <FormField
              name="genre"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="genre-select">
                    Genre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="genre-select"
                        className="bg-yellow-400 w-32"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-32">
                        <SelectItem value="math">Arithmatic</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">Algebra</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <PreviewModal
              dataContext={{
                questionName: watchedValues.questionName || "",
                question: watchedValues.question || "",
                answer: watchedValues.answer || "",
                solution: watchedValues.solution || "",
                mark: watchedValues.mark || "",
                difficulty: watchedValues.difficulty || "",
                genre: watchedValues.genre || "",
              }}
            >
              <Button type="button" variant={"ghost"} className="bg-gray-200">
                Preview
              </Button>
            </PreviewModal>

            <Button type="submit" variant={"outline"}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
