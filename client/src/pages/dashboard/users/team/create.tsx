import { ProtectedPage } from "@/components/layout";
import { TeamDataTableForm } from "@/components/ui/Users/team-data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateTeam />
    </ProtectedPage>
  );
}

function CreateTeam() {
  return <TeamDataTableForm />;
}
