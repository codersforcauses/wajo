import DashboardLayout from "@/components/dashboard-layout";
import { TeacherDataTableForm } from "@/components/ui/Users/teacher-user-data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div>
      <TeacherDataTableForm />
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
