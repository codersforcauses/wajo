import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAuth } from "@/context/auth-provider";
import { loginSchema } from "@/types/user";

interface LoginFormProps {
  children: ReactNode;
}

interface UserLogin {
  username: string;
  password: string;
}

/**
 * The `LoginModal` component renders a modal for user login functionality.
 * It utilizes `react-hook-form` with Zod schema validation to ensure input data adheres to predefined rules.
 * The modal includes fields for username and password, a password visibility toggle, and handles form submission.
 * Response is displayed via toast notifications upon success or failure.
 *
 * @see {@link https://ui.shadcn.com/docs/components/dialog} for more details.
 * @see {@link https://ui.shadcn.com/docs/components/form} for more details.
 *
 * @component
 * @example
 * <LoginModal>
 *   <Button>Open Login Modal</Button>
 * </LoginModal>
 *
 * @param {React.ReactNode} children - The child components to trigger the login modal.
 */
export function LoginModal({ children }: LoginFormProps) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuth();

  const handleLogin = async (data: UserLogin) => {
    const { success, error } = await login(data.username, data.password);
    if (success) {
      toast.success("You are now logged in.");
    } else {
      toast.error(error || "Something went wrong.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="flex h-full max-h-[460px] w-[95%] max-w-[600px] items-center rounded-[40px] border-0 bg-accent p-1 shadow-lg"
        style={{ borderRadius: "32px" }}
      >
        <div className="h-full w-full overflow-y-auto rounded-[30px] border-4 border-accent bg-white px-10 py-4">
          <div className="flex justify-center pb-5">
            <DialogHeader>
              <DialogTitle className="text-[54px] font-bold">Login</DialogTitle>
            </DialogHeader>
          </div>

          {/* Login Form */}
          <Form {...loginForm}>
            <form
              id="login_form"
              onSubmit={loginForm.handleSubmit(handleLogin)}
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
                              <EyeOffIcon
                                className="h-6 w-6"
                                strokeWidth={1.5}
                              />
                            ) : (
                              <EyeIcon className="h-6 w-6" strokeWidth={1.5} />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      {/* <FormDescription className="text-xs">
                        It must be a combination of minimum 8 letters, numbers,
                        and symbols
                      </FormDescription> */}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                className="w-full border-[1.5px] border-black"
                type="submit"
              >
                Log In
              </Button>
            </form>
          </Form>

          <DialogFooter className="mt-4 flex justify-center border-t-2 pt-2 text-sm text-gray-500">
            <p className="mx-10">
              If you forget your username or password, please contact your
              teacher or administrator.
            </p>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
