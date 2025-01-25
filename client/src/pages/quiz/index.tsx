import HorizontalCard from "@/components/ui/horizontal-card";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Quiz } from "@/types/quiz";

import { NextPageWithLayout } from "../_app";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */
const QuizPage: NextPageWithLayout = () => {
  // mock data
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<Quiz[]>({
    queryKey: ["quiz.list"],
    endpoint: "/quiz/list",
  });

  let upcomingCompetition = quizData?.filter(
    (quiz) => quiz.quizType === "Competition",
  );
  let pastPapers = quizData?.filter((quiz) => quiz.quizType === "PastPaper");
  let practiceTests = quizData?.filter((quiz) => quiz.quizType === "Practice");
  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center bg-white text-center">
      <section className="my-4 flex min-h-32 w-full flex-col items-center justify-center bg-[#FFD659] p-4">
        <h2>Upcoming Competition</h2>
        <h6 className="my-4">
          Competition will start at{" "}
          {upcomingCompetition
            ? upcomingCompetition[0].startTime.toString()
            : "[TBD]"}{" "}
        </h6>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {/* {upcomingCompetitions.map((quiz) => (
            <HorizontalCard
              title={quiz.title}
              href={`quiz/competition/${quiz.id}`}
            />
          ))} */}
          <HorizontalCard
            title="2025 Competition"
            href={`quiz/competition/${upcomingCompetition ? upcomingCompetition[0].id : "[TBD]"}`}
          />
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
        <h2 className="mb-4">Past Questions and Solutions</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {pastPapers?.map((quiz) => (
            <HorizontalCard
              title={quiz.name}
              href={`quiz/pastpaper/${quiz.id}`}
            />
          ))}
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
        <h2 className="mb-4">Practice Tests</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {practiceTests?.map((quiz) => (
            <HorizontalCard
              title={quiz.name}
              href={`quiz/practice/${quiz.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizPage;
