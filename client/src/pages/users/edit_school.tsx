import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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

// Define the Zod schema for validation
const formSchema = z.object({
  schoolName: z.string().min(1, "School Name is required"),
  schoolAssociation: z.string().min(1, "School Association is required"),
  contactEmail: z.string().email("Invalid email address"),
  schoolType: z.string().min(1, "School type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const Index = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integrate zod validation
    defaultValues: {
      schoolName: "",
      schoolAssociation: "",
      contactEmail: "",
      schoolType: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Handle form submission
    // submit data to the server
    //[TODO]: Implement form submission logic

    console.log("Form Data:", data);
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/3 space-y-6"
          >
            {/* Question Name */}
            <FormField
              name="schoolName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    School Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Please input school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="schoolAssociation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    School Association <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please input school association"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contactEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please input contact email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="schoolType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    School Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Please input school type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Question */}
            <div className="flex justify-end gap-4">
              <Button type="submit" variant={"outline"}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Index;
