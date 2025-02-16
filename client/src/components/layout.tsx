import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
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
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait for one tick to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      setIsInitializing(false);
      if (!isLoggedIn || !requiredRoles.includes(userRole)) {
        router.replace(`/not-authorized?next=${router.pathname}`);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoggedIn, userRole, requiredRoles, router]);

  if (isInitializing) return <WaitingLoader />;
  if (!isLoggedIn || !requiredRoles.includes(userRole))
    return <WaitingLoader />;

  // Render authorized content
  return (
    <Sidebar
      role={userRole.toLowerCase() as Role}
      isShowBreadcrumb={userRole !== Role.STUDENT}
    >
      {children}
    </Sidebar>
  );
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
