import { useEffect, useState } from "react";

import { useTokenStore } from "@/store/token-store";

export default function Dashboard() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { access } = useTokenStore(); // access the JWT token
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (access?.decoded) {
      const userRole = access.decoded["role"];
      setRole(userRole);
    }
    // wait for auth to be checked before rendering
    setIsAuthChecked(true);
  }, [access]);

  if (!isAuthChecked) return null;

  return (
    <div className="flex h-[90vh] items-center justify-center">
      <h1>
        Welcome to {role && `${role.charAt(0).toUpperCase()}${role.slice(1)}`}{" "}
        Dashboard
      </h1>
    </div>
  );
}
