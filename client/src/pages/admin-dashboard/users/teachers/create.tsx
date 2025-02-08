import DashboardLayout from "@/components/dashboard-layout";
import { DataTableForm } from "@/components/ui/Users/data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div>
      <DataTableForm />
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
