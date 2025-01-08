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
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="input"
                    placeholder="Enter Username"
                  />
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
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    className="input"
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
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="email"
                    className="input"
                    placeholder="Enter Email"
                  />
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
              <FormItem>
                <FormLabel>School:</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="input"
                    placeholder="Enter School"
                  />
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
