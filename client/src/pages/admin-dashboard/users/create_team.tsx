import DashboardLayout from "@/components/dashboard-layout";
import { TeamDataTableForm } from "@/components/ui/Users/team-data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return <TeamDataTableForm />;
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
