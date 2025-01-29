import Link from "next/link";

import { StudentDataTableForm } from "@/components/ui/Users/student-data-table-form";

export default function Create() {
  return (
    <div className="m-auto flex items-center justify-center gap-20 border border-red-500">
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="/users/create/students/"
      >
        Create Students
      </Link>
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="/users/create/teachers/"
      >
        Create Teachers
      </Link>
      <Link
        className="flex h-52 w-52 items-center justify-center rounded-lg bg-yellow text-center text-xl hover:bg-yellow/80"
        href="/users/create/staffs/"
      >
        Create Admins
      </Link>
    </div>
  );
}
