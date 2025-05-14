import Cookies from "js-cookie";

import { ProtectedPage } from "@/components/layout";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER, Role.STUDENT];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Dashboard />
    </ProtectedPage>
  );
}

function Dashboard() {
  const userRole = Cookies.get("user_role");
  return (
    <div className="container flex h-[90vh] items-center justify-center text-balance">
      <h1>
        Welcome to the{" "}
        {userRole && `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}`}{" "}
        Dashboard
      </h1>
    </div>
  );
}
