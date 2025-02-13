import DashboardLayout from "@/components/dashboard-layout";
import { SchoolDataTableForm } from "@/components/ui/Users/school-data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return <SchoolDataTableForm />;
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
