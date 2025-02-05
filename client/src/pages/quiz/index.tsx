import HorizontalCard from "@/components/ui/horizontal-card";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AdminQuiz } from "@/types/quiz";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */
export default function QuizPage() {
  // mock data
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<AdminQuiz[]>({
    queryKey: ["quizzes"],
    endpoint: "/quiz/all_quizzes",
  });

  let upcomingCompetition = quizData?.filter((quiz) => quiz.is_comp === true);
  // let pastPapers = quizData?.filter((quiz) => quiz.is_comp === false);
  let practiceTests = quizData?.filter((quiz) => quiz.is_comp === false);
  let pastPapers: Array<AdminQuiz> = [];
  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center bg-white text-center">
      <section className="my-4 flex min-h-32 w-full flex-col items-center justify-center bg-[#FFD659] p-4">
        <h2>{new Date().getFullYear()} Competition</h2>
        <h6 className="my-4">
          Competition will start at{" "}
          {upcomingCompetition
            ? upcomingCompetition[0].open_time_date.toString()
            : "[TBD]"}{" "}
        </h6>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <HorizontalCard
            title="2025 Competition"
            href={`quiz/competition/${upcomingCompetition ? upcomingCompetition[0].id : "[TBD]"}`}
          />
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
        <h2 className="mb-4">Past Questions and Solutions</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {pastPapers && pastPapers.length > 0 ? (
            pastPapers.map((quiz) => (
              <HorizontalCard
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
          {practiceTests && practiceTests.length > 0 ? (
            practiceTests.map((quiz) => (
              <HorizontalCard
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
