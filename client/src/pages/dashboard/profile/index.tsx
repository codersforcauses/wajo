import { useEffect, useState } from "react";

import { ProtectedPage } from "@/components/layout";
import { WaitingLoader } from "@/components/ui/loading";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useTokenStore } from "@/store/token-store";
import type { Profile } from "@/types/user";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER, Role.STUDENT];
  return (
    <ProtectedPage requiredRoles={roles}>
      <UserProfile />
    </ProtectedPage>
  );
}

const UserProfile = () => {
  const { data, isLoading, isError, error } = useFetchData<Profile>({
    queryKey: [`users.profile`],
    endpoint: `/users/profile/`,
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>{data.username}</h1>
      <p>Teacher ID: {data.teacher_id}</p>
      <p>School ID: {data.school_id}</p>
      {/* Render other profile details as needed */}
    </div>
  );
};
