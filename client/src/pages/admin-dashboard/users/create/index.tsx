import Link from "next/link";

import DashboardLayout from "@/components/dashboard-layout";
import { StudentDataTableForm } from "@/components/ui/Users/student-data-table-form";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div className="m-auto flex items-center justify-center gap-20 border border-red-500">
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="create/students/"
      >
        Create Students
      </Link>
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="create/teachers/"
      >
        Create Teachers
      </Link>
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="create/staffs/"
      >
        Create Admins
      </Link>
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
