import { ProtectedPage } from "@/components/layout";
// import { DataTableForm } from "@/components/ui/Users/data-table-form";
import { TeacherDataTableForm } from "@/components/ui/Users/teacher-data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateTeacher />
    </ProtectedPage>
  );
}

function CreateTeacher() {
  return <TeacherDataTableForm />;
}
