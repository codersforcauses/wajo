import React, { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import { useTokenStore } from "@/store/token-store";
import { Role } from "@/types/user";

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
  const { access } = useTokenStore(); // access the JWT token
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
    // wait for auth to be checked before rendering
    setIsAuthChecked(true);
  }, [access]);

  if (!isAuthChecked) return null;

  if (!access) {
    return (
      <div>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    );
  }

  if (!role) {
    return (
      <div>
        <Navbar />
        <main>
          <div>Failed to get user role.</div>
        </main>
      </div>
    );
  }

  return <Sidebar role={role.toLowerCase() as Role}>{children}</Sidebar>;
}
