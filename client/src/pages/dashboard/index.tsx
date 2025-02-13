import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import { NextPageWithLayout } from "@/pages/_app";
import { useTokenStore } from "@/store/token-store";

const DashboardPage: NextPageWithLayout = () => {
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
        {role && `${role.charAt(0).toUpperCase()}${role.slice(1)}`} Dashboard
      </h1>
    </div>
  );
};

DashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
