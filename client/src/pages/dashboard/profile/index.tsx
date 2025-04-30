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
      <h1>
        {data.first_name} {data.last_name}'s Profile
      </h1>
      <p>Username: {data.username}</p>
      <p>Role: {data.role}</p>
      {data.role === "student" && (
        // Render student-specific details
        <div>
          <p>Year Level: {data.year_level}</p>
          <p>School: {data.school_name}</p>
        </div>
      )}
      {data.role === "teacher" && (
        // Render teacher-specific details
        <div>
          <p>School: {data.school_name}</p>
          <p>School type: {data.school_type}</p>
          <p>Email: {data.teacher_email}</p>
          <p>Phone: {data.phone}</p>
        </div>
      )}
      {data.role === "admin" && (
        // Render admin-specific details
        <div>
          <p>Is staff? {data.is_staff}</p>
          <p>Is superuser? {data.is_superuser}</p>
        </div>
      )}
    </div>
  );
};
