import Link from "next/link";

import {
  ProtectedPage,
  ResultsLayout,
  useQuizResultsContext,
} from "@/components/layout";
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
  const { quizId, quizName } = useQuizResultsContext();
  const links = [
    { href: `${quizId}/individuals`, label: "Individuals" },
    { href: `${quizId}/teams`, label: "Teams" },
    { href: `${quizId}/insights`, label: "Insights" },
    { href: `${quizId}/question-attempts`, label: "Question attempts" },
    { href: `${quizId}/teamlist`, label: "Team list" },
  ];
  console.log(quizId);
  console.log(quizName);
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-5">
        <h2 className="text-3xl font-bold">{quizName}</h2>
        <h3 className="text-xl italic">Select results:</h3>
      </div>

      <div className="flex items-center justify-center gap-10">
        {links.map(({ href, label }) => (
          <div
            key={href}
            className="flex h-52 w-52 items-center justify-center rounded-md border-2 border-yellow font-semibold hover:bg-yellow"
          >
            <Link
              className="flex h-full w-full items-center justify-center text-center text-xl"
              href={href}
            >
              {label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
