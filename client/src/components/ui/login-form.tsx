import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
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
import { loginSchema } from "@/types/user";

interface LoginFormProps {
  onSubmit: (data: z.infer<typeof loginSchema>) => void;
}

/**
 * The `LoginForm` component provides a form for users to log in with their username and password.
 * It uses `react-hook-form` for form handling and validation with Zod schema, ensuring that the form fields
 * meet specific requirements before submission. The component also includes a password visibility toggle.
 *
 * @see {@link https://ui.shadcn.com/docs/components/form} for more details.
 *
 * @component
 * @example
 * <LoginForm onSubmit={handleLoginSubmit} />
 *
 * @param {Function} props.onSubmit - The callback function to handle form submission with the login data.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-bold">Welcome</h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Please log in to continue
      </p>

      <Form {...loginForm}>
        <form
          id="login_form"
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel className="md:max-5xl:text-lg font-bold">
                  Username
                </FormLabel>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      {...field}
                      className="h-11 bg-[#EFF1ED] placeholder-black"
                      placeholder="Please enter your username"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel className="md:max-5xl:text-lg font-bold">
                  Password
                </FormLabel>
                <div className="flex flex-col gap-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={passwordVisibility ? "text" : "password"}
                        {...field}
                        className="h-11 bg-[#EFF1ED] placeholder-black"
                        placeholder="Please enter your password"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                        onClick={() =>
                          setPasswordVisibility(!passwordVisibility)
                        }
                      >
                        {passwordVisibility ? (
                          <EyeOffIcon className="h-6 w-6" strokeWidth={1.5} />
                        ) : (
                          <EyeIcon className="h-6 w-6" strokeWidth={1.5} />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    It must be a combination of minimum 8 letters, numbers, and
                    symbols
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;
