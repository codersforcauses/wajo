import { ProtectedPage } from "@/components/layout";
import { StaffDataTableForm } from "@/components/ui/Users/staff-data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateStaff />
    </ProtectedPage>
  );
}

function CreateStaff() {
  return <StaffDataTableForm />;
}
