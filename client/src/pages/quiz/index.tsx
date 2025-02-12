import { useEffect } from "react";

import HorizontalCard from "@/components/ui/horizontal-card";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Competition, Quiz } from "@/types/quiz";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */
export default function QuizPage() {
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<Quiz[]>({
    queryKey: ["quizzes.all"],
    endpoint: "/quiz/all_quizzes/",
  });

  const {
    data: compQuizData,
    isLoading: isCompQuizDataLoading,
    isError: isCompQuizDataError,
    error: compQuizDataError,
  } = useFetchData<Competition[]>({
    queryKey: ["quizzes.competition"],
    endpoint: "/quiz/competition/",
  });

  let pastPapers: Array<Quiz> = [];

  useEffect(() => {
    console.log("Quiz Data: ", quizData);
    console.log("Competition Quiz Data: ", compQuizData);
  }, [quizData, compQuizData]);

  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center bg-white text-center">
      <section className="my-4 flex min-h-32 w-full flex-col items-center justify-center bg-[#FFD659] p-4">
        <h2>{new Date().getFullYear()} Competition</h2>
        <h6 className="my-4">
          Competition will start at{" "}
          {compQuizData && compQuizData.length > 0
            ? compQuizData[0].open_time_date.toString()
            : "[TBD]"}{" "}
        </h6>

        <div className="flex w-full flex-col items-center justify-center gap-4">
          <HorizontalCard
            title={
              compQuizData && compQuizData.length > 0
                ? compQuizData[0].name
                : ""
            }
            href={`quiz/competition/${compQuizData && compQuizData.length > 0 ? compQuizData[0].id : ""}`}
          />
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
        <h2 className="mb-4">Past Questions and Solutions</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {pastPapers && pastPapers.length > 0 ? (
            pastPapers.map((quiz) => (
              <HorizontalCard
                key={quiz.id}
                title={quiz.name}
                href={`quiz/pastpapers/${quiz.id}`}
              />
            ))
          ) : (
            <HorizontalCard title={"Coming soon!"} href={`quiz/pastpapers/1`} />
          )}
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
        <h2 className="mb-4">Practice Tests</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {quizData && quizData.length > 0 ? (
            quizData.map((quiz) => (
              <HorizontalCard
                key={quiz.id}
                title={quiz.name}
                href={`quiz/practice/${quiz.id}`}
              />
            ))
          ) : (
            <HorizontalCard title={"Coming soon!"} href={`quiz/`} />
          )}
        </div>
      </section>
    </div>
  );
}
