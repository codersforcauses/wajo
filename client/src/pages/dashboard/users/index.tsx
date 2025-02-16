import Link from "next/link";

import { ProtectedPage } from "@/components/layout";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN, Role.TEACHER];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Create />
    </ProtectedPage>
  );
}

function Create() {
  const links = [
    { href: "users/students", label: "students" },
    { href: "users/teachers", label: "teachers" },
    { href: "users/staffs", label: "staff" },
  ];
  return (
    <div className="flex h-[80vh] items-center justify-center gap-10">
      {links.map(({ href, label }) => (
        <div
          key={href}
          className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-yellow hover:bg-yellow"
        >
          <Link
            className="flex h-full w-full items-center justify-center text-center"
            href={href}
          >
            {label}
          </Link>
        </div>
      ))}
    </div>
  );
}
