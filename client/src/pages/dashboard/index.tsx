import Cookies from "js-cookie";

import { ProtectedPage } from "@/components/page-config";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Dashboard />
    </ProtectedPage>
  );
}

function Dashboard() {
  const userRole = Cookies.get("user_role");
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <h1>
        Welcome to{" "}
        {userRole && `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}`}{" "}
        Dashboard
      </h1>
    </div>
  );
}
