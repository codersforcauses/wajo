import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
import { QuestionBlockManager } from "@/components/ui/Test/question-block-manager";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import { createCompetitionSchema } from "@/types/competition";

type Competition = z.infer<typeof createCompetitionSchema>;

export default function Create() {
  const form = useForm<Competition>({
    resolver: zodResolver(createCompetitionSchema),
    defaultValues: {} as Competition,
  });

  const onSubmit = (data: Competition) => {
    console.log("Form Data:", data);
    alert("see console for full data.");
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">
          Create Competition
        </h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          <h3 className="-mb-2 text-lg">Basic</h3>
          {/* Test Name */}
          <FormField
            name="name"
            control={form.control}
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input test name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* General Instructions */}
          <FormField
            name="general_instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>General Instructions {requiredStar}</FormLabel>
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
          <div className="flex">
            {/* Starting Time */}
            <FormField
              name="start_time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Time {requiredStar}</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ending Time */}
            <FormField
              name="end_time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ending Time {requiredStar}</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Question Blocks */}
        <div className="mx-auto my-4 max-w-3xl space-y-4 rounded-lg bg-gray-50 p-4 shadow-lg">
          <h3 className="-mb-2 text-lg">Question Blocks {requiredStar}</h3>
          <span className="text-xs text-gray-400">
            Questions inside a block are randomly sorted.
          </span>
          <QuestionBlockManager formControl={form.control} />
        </div>
        <div className="flex justify-center gap-4">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
