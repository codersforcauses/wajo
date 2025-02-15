import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

import { ProtectedPage } from "@/components/page-config";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <NotAuthorizedPage />
    </ProtectedPage>
  );
}

function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-in flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
      <h1 className="font-black text-red-600">Access Denied</h1>
      <p className="text-lg font-bold text-gray-600">
        You do not have permission to view this page.
      </p>
      <Button
        onClick={() => router.push("/")}
        variant="outline"
        className="mt-6 flex animate-bounce items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Button>
    </div>
  );
}
