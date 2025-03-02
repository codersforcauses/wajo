import { ProtectedPage } from "@/components/layout";
import { DataTableForm } from "@/components/ui/Users/data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateStudent />
    </ProtectedPage>
  );
}

function CreateStudent() {
  return <DataTableForm />;
}
