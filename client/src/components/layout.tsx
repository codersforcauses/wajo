import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [authState, setAuthState] = useState<
    "initializing" | "authorized" | "unauthorized" | "wrong-role"
  >("initializing");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      if (!isLoggedIn || !userRole) {
        setAuthState("unauthorized");
        // console.log("authState", authState);
      } else if (!requiredRoles.includes(userRole)) {
        setAuthState("wrong-role");
        // console.log("authState", authState);
      } else {
        setAuthState("authorized");
        // console.log("authState", authState);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isLoggedIn, userRole, requiredRoles]);

  if (isInitializing) return <WaitingLoader />;
  // console.log(userRole);
  // console.log(authState);
  switch (authState) {
    case "unauthorized":
      return (
        <PublicPage>
          <NotAuthorizedPage />
        </PublicPage>
      );
    case "wrong-role":
      return (
        <Sidebar
          role={userRole.toLowerCase() as Role}
          isShowBreadcrumb={userRole !== Role.STUDENT}
        >
          <PublicPage isNavBar={false} isFooter={false}>
            <NotAuthorizedPage />
          </PublicPage>
        </Sidebar>
      );
    case "authorized":
      // console.log("inside authorized");
      return (
        <Sidebar
          role={userRole.toLowerCase() as Role}
          isShowBreadcrumb={userRole !== Role.STUDENT}
        >
          {children}
        </Sidebar>
      );
    default:
      return <WaitingLoader />;
  }
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

function NotAuthorizedPage() {
  const router = useRouter();
  const { userRole, logout } = useAuth();

  const handleLogout = () => {
    router.push("/").then(() => logout());
  };

  return (
    <div className="animate-fade-in flex min-h-[50vh] flex-col items-center justify-center gap-5 py-4 text-center">
      <h1 className="font-black text-red-600">Access Denied</h1>
      <p className="text-lg font-bold text-gray-600">
        {userRole
          ? `Role[${userRole}] do not have permission to view this page.`
          : `Unabled to identify user.`}
      </p>
      <Button
        onClick={userRole ? () => router.push("/dashboard") : handleLogout}
        variant="outline"
        className="mt-6 flex animate-bounce items-center gap-2"
      >
        <ArrowLeft size={18} />
        {userRole ? "Back to Dashboard" : "Logout"}
      </Button>
    </div>
  );
}
