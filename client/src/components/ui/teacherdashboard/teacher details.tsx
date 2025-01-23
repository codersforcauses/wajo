import { useForm } from "react-hook-form";

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

const TeacherDetails = () => {
  const formMethods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <h2>Teacher Details</h2>
      <Form {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Username Field */}
          <FormField
            control={formMethods.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel className="w-32 font-bold">Username:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel className="w-32 font-bold">Password:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel className="w-32 font-bold">Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* School Field */}
          <FormField
            control={formMethods.control}
            name="school"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel className="w-32 font-bold">School:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter School" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Change credentials
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TeacherDetails;
