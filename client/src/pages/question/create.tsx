import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAnswerStore, useQuestionStore } from "@/store/question";
import { Answer, Question } from "@/types/question";
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
          "Answers must be integers between 0-999, separated by commas without spaces.",
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

export default function Create() {
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
  /*
  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    alert(JSON.stringify(data, null, 2));
  };
*/
  //Extract the relevant actions from the Question/Answer store to use
  const createQuestion = useQuestionStore((state) => state.createQuestion);
  const createAnswer = useAnswerStore((state) => state.createAnswer);

  const onSubmit = async (data: FormValues) => {
    try {
      //Prepare the Question payload with form data
      const newQuestion: Question = {
        name: data.questionName,
        question_text: data.question,
        description: data.solution || "",
        default_mark: parseInt(data.mark, 10),
        difficulty: data.difficulty.toUpperCase(),
        category: parseInt(data.genre, 10),
      };

      //Create the Question and get its ID, needed to create associated answer
      const createdQuestion = await createQuestion(newQuestion);
      const questionId = createdQuestion.id as number;

      //Prepare the Answer payload with form data and Question ID
      const newAnswer: Answer = {
        question: questionId,
        answer: data.answer,
        feedback: data.solution || "",
      };

      //Then create answer, no need to return anything
      await createAnswer(newAnswer);

      alert("Question and Answer created successfully!");
    } catch (error) {
      console.error("Error creating question or answer:", error);
      alert("Failed to create question and answer");
    }
  };

  return (
    <div className="mx-auto my-4 max-w-3xl rounded-lg bg-gray-50 p-4 shadow-lg">
      <h1 className="mb-6 text-center text-xl font-bold">Create Question</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Question Name */}
          <FormField
            name="questionName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Question Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Please input question name" {...field} />
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
                <FormLabel>
                  Question <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
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
                <FormLabel>
                  Answer <span className="text-red-500">*</span>
                </FormLabel>
                <FormDescription>
                  Must be an integer from 0-999, use “,” to separate multiple
                  answers
                </FormDescription>
                <FormControl>
                  <Input placeholder="Please input answer" {...field} />
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
                <FormLabel>Solution</FormLabel>
                <FormControl>
                  <Textarea placeholder="Please input solution" {...field} />
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
                <FormLabel>
                  Mark <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
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
                  <FormLabel>
                    Difficulty <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-yellow-400 w-24">
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
                  <FormLabel>
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-yellow-400 w-32">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-32">
                        <SelectItem value="1">Arithmatic</SelectItem>
                        <SelectItem value="2">Multiplication</SelectItem>
                        <SelectItem value="3">Algebra</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant={"ghost"} className="bg-gray-200">
              Preview
            </Button>
            <Button type="submit" variant={"outline"}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
