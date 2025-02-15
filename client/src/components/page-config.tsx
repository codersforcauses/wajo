import { useRouter } from "next/router";
import { useEffect } from "react";

import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";
import { WaitingLoader } from "@/components/ui/loading";
import { useAuth } from "@/context/auth-provider";
import { Role } from "@/types/user";

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRoles: Role[];
}

export function ProtectedPage({ children, requiredRoles }: ProtectedPageProps) {
  const { userRole, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is not logged in or does not have the required role
    if (!isLoggedIn || !requiredRoles.includes(userRole)) {
      router.push(`/not-authorized?next=${router.pathname}`);
      return;
    }
  }, [isLoggedIn, userRole, router, requiredRoles]);

  // if still checking
  if (!isLoggedIn || !requiredRoles.includes(userRole)) {
    return <WaitingLoader />;
  }

  return children;
}

interface PublicPageProps {
  children: React.ReactNode;
  isNavBar?: boolean;
  isFooter?: boolean;
}

export function PublicPage({
  children,
  isNavBar = true,
  isFooter = true,
}: PublicPageProps) {
  return (
    <div>
      {isNavBar ? <Navbar /> : null}
      <main>{children}</main>
      {isFooter ? <Footer /> : null}
    </div>
  );
}
