import { ProtectedPage } from "@/components/page-config";
import { CategoryDataTableForm } from "@/components/ui/Question/category-data-table-form";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateCategory />
    </ProtectedPage>
  );
}

function CreateCategory() {
  return <CategoryDataTableForm />;
}
