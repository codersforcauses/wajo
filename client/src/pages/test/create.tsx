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
import { SelectHour, SelectMinute } from "@/components/ui/Test/select-time";
import { Textarea } from "@/components/ui/textarea";
import { createPracticeSchema } from "@/types/practice";

type Practice = z.infer<typeof createPracticeSchema>;

export default function Create() {
  const form = useForm<Practice>({
    resolver: zodResolver(createPracticeSchema),
    defaultValues: {} as Practice,
  });

  const onSubmit = (data: Practice) => {
    console.log("Form Data:", data);
    alert("see console for full data.");
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">
          Create Practice Test
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

          {/* Time Limitation */}
          <div>
            <FormLabel>Time Limitation {requiredStar}</FormLabel>
            <div className="mt-2 flex gap-4">
              {/* Hours */}
              <FormField
                name="hours"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectHour
                        selectedTime={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Minutes */}
              <FormField
                name="minutes"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectMinute
                        selectedTime={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

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
