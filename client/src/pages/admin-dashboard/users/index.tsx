import Link from "next/link";

import DashboardLayout from "@/components/dashboard-layout";
import { NextPageWithLayout } from "@/pages/_app";

const CreatePage: NextPageWithLayout = () => {
  return (
    <div className="flex h-[80vh] items-center justify-center gap-10">
      <div className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-yellow hover:bg-yellow">
        <Link
          className="flex h-full w-full items-center justify-center text-center"
          href="users/students"
        >
          students
        </Link>
      </div>
      <div className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-yellow hover:bg-yellow">
        <Link
          className="flex h-full w-full items-center justify-center text-center"
          href="users/teachers"
        >
          teachers
        </Link>
      </div>
      <div className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-yellow hover:bg-yellow">
        <Link
          className="flex h-full w-full items-center justify-center text-center"
          href="users/staffs"
        >
          staff
        </Link>
      </div>
    </div>
  );
};

CreatePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreatePage;
