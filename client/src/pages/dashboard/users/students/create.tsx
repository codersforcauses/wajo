import { ProtectedPage } from "@/components/layout";
import { WaitingLoader } from "@/components/ui/loading";
import { DataTableForm } from "@/components/ui/Users/data-table-form";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Profile, Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <CreateStudent />
    </ProtectedPage>
  );
}

function CreateStudent() {
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useFetchData<Profile>({
    queryKey: [`users.profile`],
    endpoint: `/users/profile/`,
  });

  if (isLoading || !profileData) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  return <DataTableForm schoolID={Number(profileData.school_id)} />;
}
