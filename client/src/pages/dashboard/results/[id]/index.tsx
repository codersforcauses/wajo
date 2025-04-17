import Link from "next/link";

import { ProtectedPage, ResultsLayout, useQuizId } from "@/components/layout";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <ResultsLayout>
        <Index />
      </ResultsLayout>
    </ProtectedPage>
  );
}

function Index() {
  const quizId = useQuizId();
  const links = [
    { href: `${quizId}/individuals`, label: "individuals" },
    { href: `${quizId}/teams`, label: "teams" },
    { href: `${quizId}/insights`, label: "insights" },
    { href: `${quizId}/question-attempts`, label: "question-attempts" },
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
