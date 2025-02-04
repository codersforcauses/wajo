import DashboardLayout from "@/components/dashboard-layout";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Staffs</h1>
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
