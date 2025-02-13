import DashboardLayout from "@/components/dashboard-layout";
import { StaffDataTableForm } from "@/components/ui/Users/staff-data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className="py-4 text-center text-2xl">Create Students</h1>
      <StaffDataTableForm />
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
