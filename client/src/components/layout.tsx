import React, { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import { WaitingLoader } from "@/components/ui/loading";
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { User } from "@/types/user";

import Sidebar from "./sidebar";
import Footer from "./ui/footer";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the application with a Navbar or Sidebar based on user authentication status.
 *
 * @param {LayoutProps} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 *
 */
export default function Layout({ children }: LayoutProps) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { userId } = useAuth();
  const isLoggedIn = Boolean(userId);

  // wait for auth to be checked before rendering
  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useFetchData<User>({
    queryKey: ["user", userId],
    endpoint: "/users/me",
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId),
  });

  if (!isAuthChecked) return null;

  if (!isLoggedIn) {
    return (
      <div>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    );
  }

  if (isLoading) return <WaitingLoader />;
  if (!user) return <div>{error?.message || "Failed to load user data."}</div>;

  return <Sidebar role={user.role}>{children}</Sidebar>;
}
