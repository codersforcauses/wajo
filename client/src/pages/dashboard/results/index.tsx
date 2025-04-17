import Link from "next/link";

import { ProtectedPage } from "@/components/layout";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AdminQuizNameResponse } from "@/types/quiz";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <Index />
    </ProtectedPage>
  );
}

function Index() {
  const { data, isLoading, error } = useFetchData<AdminQuizNameResponse[]>({
    queryKey: ["quiz.admin-quizzes.quiz_names_and_ids"],
    endpoint: "/quiz/admin-quizzes/quiz_names_and_ids/",
  });

  console.log("data", data);
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-5">
      <h2 className="">Quizzes:</h2>
      <div className="flex flex-wrap items-center justify-center gap-10">
        {data?.map(({ id, name }) => (
          <div
            key={id}
            className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-yellow hover:bg-yellow"
          >
            <Link
              className="flex h-full w-full items-center justify-center text-center"
              href={`/dashboard/results/${id}`}
            >
              {name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
