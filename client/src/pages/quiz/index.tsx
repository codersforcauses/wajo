// import Layout from "@/components/layout";
import DateTimeDisplay from "@/components/ui/date-format";
import HorizontalCard from "@/components/ui/horizontal-card";
import { WaitingLoader } from "@/components/ui/loading";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Competition, Quiz } from "@/types/quiz";

// import { NextPageWithLayout } from "../_app";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */
const QuizPage = () => {
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

  if (isQuizDataLoading || !quizData || isCompQuizDataLoading || !compQuizData)
    return <WaitingLoader />;
  if (isQuizDataError) return <div>Error Quiz: {QuizDataError?.message}</div>;
  if (isCompQuizDataError)
    return <div>Error Competition: {compQuizDataError?.message}</div>;

  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center bg-white text-center">
      <CompetitionCard data={compQuizData} />
      <QuizCard
        data={pastPapers}
        title="Past Paper and Solution"
        entity="pastpaper"
      />
      <QuizCard data={quizData} title="Practice" entity="practice" />
    </div>
  );
};

function CompetitionCard({ data }: { data: Competition[] }) {
  const compData = data && data.length > 0 ? data[0] : null;
  return (
    <section className="my-4 flex min-h-32 w-full flex-col items-center justify-center bg-background2 p-4">
      <div className="text-6xl font-semibold">
        {new Date().getFullYear()} Competition
      </div>
      {compData ? (
        <>
          <div className="my-4 flex gap-2 text-lg">
            Competition will start at{" "}
            <DateTimeDisplay
              className="flex-row gap-1 font-bold"
              date={compData.open_time_date}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <HorizontalCard
              title={compData.name}
              href={`quiz/competition/${compData.id}`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="my-4 flex gap-2 text-lg">
            Competition will start at <div className="font-bold">[TBD]</div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <HorizontalCard title={"Coming Soon!"} href="#" />
          </div>
        </>
      )}
    </section>
  );
}

function QuizCard({
  data,
  title,
  entity,
}: {
  data: Quiz[];
  title: string;
  entity: string;
}) {
  const quizData = data && data.length > 0 ? data : null;
  return (
    <section className="mb-2 flex w-full flex-col items-center justify-center p-4">
      <div className="mb-4 text-5xl font-semibold">{title} Tests</div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {quizData ? (
          quizData.map((quiz) => (
            <HorizontalCard
              key={quiz.id}
              title={quiz.name}
              href={`quiz/${entity.toLowerCase()}/${quiz.id}`}
            />
          ))
        ) : (
          <HorizontalCard title={"Coming Soon!"} href="#" />
        )}
      </div>
    </section>
  );
}

// QuizPage.getLayout = (page: ReactElement) => {
//   return <Layout isPublic={true}>{page}</Layout>;
// };

export default QuizPage;
