import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProtectedPage } from "@/components/layout";
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
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import { usePostMutation } from "@/hooks/use-post-data";
import { AdminQuiz, createCompetitionTestSchema } from "@/types/quiz";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Create />
    </ProtectedPage>
  );
}

type CreateCompetition = z.infer<typeof createCompetitionTestSchema>;

function Create() {
  const form = useForm<CreateCompetition>({
    resolver: zodResolver(createCompetitionTestSchema),
    defaultValues: {
      name: "",
      intro: "",
      time_limit: 0,
      time_window: 0,
      open_time_date: new Date(),
    },
  });

  const router = useRouter();
  const { mutate: createCompetition, isPending } = usePostMutation<AdminQuiz>({
    mutationKey: ["quiz.admin-quizzes.create"],
    endpoint: "/quiz/admin-quizzes/",
    onSuccess: (res) => {
      toast.success(
        "Competition created successfully! Questions blocks input available below.",
      );
      router.push(`/dashboard/test/competition/${res.data.id}`);
    },
  });

  const onSubmit = (data: CreateCompetition) => {
    createCompetition({
      name: data.name,
      intro: data.intro,
      total_marks: data.total_marks,
      open_time_date: data.open_time_date,
      time_limit: data.time_limit,
      time_window: data.time_window,
      status: 1,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">
          Create Competition
        </h1>

        <div className="mx-auto max-w-3xl space-y-5 rounded-lg bg-gray-50 p-4 shadow-lg">
          <h3 className="-mb-2 text-lg">Basic</h3>
          <div className="flex gap-4">
            <div className="flex-auto">
              {/* Test Name */}
              <FormField
                name="name"
                control={form.control}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name {requiredStar}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Please input test name"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-none">
              {/* Open Time */}
              <FormField
                name="open_time_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col gap-1.5">
                    <FormLabel>Open Time {requiredStar}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        className="h-80 overflow-scroll"
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Intro */}
          <FormField
            name="intro"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>Intro {requiredStar}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please input test general instructions"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <div className="flex-auto">
              {/* Time Limit */}
              <FormField
                name="time_limit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Please input time limit"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-auto">
              {/* Time Window */}
              <FormField
                name="time_window"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col gap-1.5">
                    <FormLabel>Time Window</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Please input time window"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        } // Convert to number
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
