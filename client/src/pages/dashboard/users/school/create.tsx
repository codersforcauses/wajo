import { ProtectedPage } from "@/components/page-config";
import { SchoolDataTableForm } from "@/components/ui/Users/school-data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateSchool />
    </ProtectedPage>
  );
}

function CreateSchool() {
  return <SchoolDataTableForm />;
}
