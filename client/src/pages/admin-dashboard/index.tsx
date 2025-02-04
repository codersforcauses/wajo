import DashboardLayout from "@/components/dashboard-layout";
import { NextPageWithLayout } from "@/pages/_app";

const AdminDashboardPage: NextPageWithLayout = () => {
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <h1>Admin Dashboard</h1>
    </div>
  );
};

AdminDashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default AdminDashboardPage;
