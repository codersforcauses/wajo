import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-provider";

export default function PageConfig() {
  return (
    <PublicPage>
      <NotAuthorizedPage />
    </PublicPage>
  );
}

function NotAuthorizedPage() {
  const router = useRouter();
  const { userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="animate-fade-in flex min-h-[50vh] flex-col items-center justify-center gap-5 py-4 text-center">
      <h1 className="font-black text-red-600">Access Denied</h1>
      <p className="text-lg font-bold text-gray-600">
        {userRole
          ? `${userRole} do not have permission to view this page.`
          : `Unabled to get Role.`}
      </p>
      {userRole ? (
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="mt-6 flex animate-bounce items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Button>
      ) : (
        <Button
          onClick={handleLogout}
          variant="outline"
          className="mt-6 flex animate-bounce items-center gap-2"
        >
          <ArrowLeft size={18} />
          Logout
        </Button>
      )}
    </div>
  );
}
