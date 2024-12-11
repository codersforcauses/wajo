import { toast } from "sonner";

import { LoginForm } from "@/components/ui/login-form";
import { useAuth } from "@/context/auth-provider";
import type { NextPageWithLayout } from "@/pages/_app";

export interface UserLogin {
  username: string;
  password: string;
}

const LoginPage: NextPageWithLayout = () => {
  const { login } = useAuth();

  const handleLogin = async (data: UserLogin) => {
    const { success, error } = await login(data.username, data.password);
    if (success) {
      toast.success("You are now logged in.");
    } else {
      toast.error(error || "Something went wrong.");
    }
  };
  return <LoginForm onSubmit={handleLogin} />;
};

export default LoginPage;
