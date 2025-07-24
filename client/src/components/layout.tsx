import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { WaitingLoader } from "@/components/ui/loading";
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AdminQuizName } from "@/types/quiz";
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
      return (
        <Sidebar role={userRole.toLowerCase() as Role}>{children}</Sidebar>
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
      <main className="min-h-svh">{children}</main>
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

// Create a context to store the quiz ID and name for the results pages
interface QuizResultsContextType {
  quizId: number;
  quizName: string | undefined;
}
// Create a context to store the quiz ID and name for the results pages
const QuizResultsContext = createContext<QuizResultsContextType | undefined>(
  undefined,
);

export const useQuizResultsContext = () => {
  const context = useContext(QuizResultsContext);
  if (!context) {
    throw new Error(
      "useQuizResultsContext must be used within a QuizResultsContext.Provider",
    );
  }
  return context;
};

export function ResultsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { id } = router.query;

  const quizId = typeof id === "string" ? parseInt(id, 10) : undefined;

  // fetch quiz name
  const { data, isLoading, error } = useFetchData<AdminQuizName>({
    queryKey: [`quiz.admin-quizzes.get_quiz_name.${quizId}`],
    endpoint: `/quiz/admin-quizzes/get_quiz_name/?quiz_id=${quizId}`,
  });

  const quizName = data?.name;

  if (!quizId || isNaN(quizId)) {
    return <div>Error: Quiz ID is missing or invalid</div>;
  }

  if (isLoading) {
    return <WaitingLoader />;
  }

  if (error) {
    return <div>Error: Failed to fetch quiz data</div>;
  }
  return (
    <QuizResultsContext.Provider value={{ quizId, quizName }}>
      <div>{children}</div>
    </QuizResultsContext.Provider>
  );
}
