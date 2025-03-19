// import Layout from "@/components/layout";
import { useEffect } from "react";

import { PublicPage } from "@/components/layout";
import DateTimeDisplay from "@/components/ui/date-format";
import HorizontalCard from "@/components/ui/horizontal-card";
import { WaitingLoader } from "@/components/ui/loading";
import { useFetchData } from "@/hooks/use-fetch-data";
import {
  Competition,
  CompetitionResponse,
  Quiz,
  QuizResponse,
} from "@/types/quiz";

// import { NextPageWithLayout } from "../_app";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */

export default function PageConfig() {
  return (
    <PublicPage>
      <QuizPage />
    </PublicPage>
  );
}

const QuizPage = () => {
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<QuizResponse>({
    queryKey: ["quizzes.all"],
    endpoint: "/quiz/all_quizzes/",
  });

  const {
    data: compQuizData,
    isLoading: isCompQuizDataLoading,
    isError: isCompQuizDataError,
    error: compQuizDataError,
  } = useFetchData<CompetitionResponse>({
    queryKey: ["quizzes.competition"],
    endpoint: "/quiz/competition/",
  });

  let pastPapers: Array<Quiz> = [];

  useEffect(() => {
    console.log("Quiz Data: ", quizData);
    console.log("Competition Data: ", compQuizData);
  }, [quizData, compQuizData]);

  if (isQuizDataLoading || !quizData || isCompQuizDataLoading || !compQuizData)
    return <WaitingLoader />;
  if (isQuizDataError) return <div>Error Quiz: {QuizDataError?.message}</div>;
  if (isCompQuizDataError)
    return <div>Error Competition: {compQuizDataError?.message}</div>;

  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center bg-white text-center">
      <CompetitionCard data={compQuizData.results} />
      <QuizCard
        data={pastPapers}
        title="Past Paper and Solution"
        entity="pastpaper"
      />
      <QuizCard data={quizData.results} title="Practice" entity="practice" />
    </div>
  );
};

function CompetitionCard({ data }: { data: Competition[] }) {
  const compData = data && data.length > 0 ? data : null;
  const curDate = new Date();
  const curTime = curDate.toISOString();

  let endTimes = [];

  if (compData) {
    for (let i = 0; i < compData.length; i++) {
      let openTime = new Date(compData[i].open_time_date);
      let endTime = new Date(
        openTime.setMinutes(
          openTime.getMinutes() +
            compData[i].time_limit +
            compData[i].time_window,
        ),
      ).toISOString();
      endTimes.push(endTime);
    }
  }

  let validCompCounter = 0;

  console.log("Current Time: ", curTime);
  console.log("End Times: ", endTimes);
  return (
    <section className="my-4 flex min-h-32 w-full flex-col items-center justify-center bg-background2 p-4">
      <div className="text-6xl font-semibold">
        {new Date().getFullYear()} Competition
      </div>
      {compData ? (
        <>
          {compData.map(
            (comp, index) =>
              endTimes[index] > curTime &&
              (() => {
                validCompCounter++;
                return (
                  <div key={comp.id} className="w-full border border-red-500">
                    <div className="my-4 flex justify-center gap-2 text-center text-lg">
                      Competition will start at{" "}
                      <DateTimeDisplay
                        className="flex-row gap-1 font-bold"
                        date={comp.open_time_date}
                      />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-4">
                      <HorizontalCard
                        title={comp.name}
                        href={`quiz/competition/${comp.id}`}
                      />
                    </div>
                  </div>
                );
              })(),
          )}
          {validCompCounter === 0 && (
            <>
              <div className="my-4 flex gap-2 text-lg">
                Competition will start at <div className="font-bold">[TBD]</div>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <HorizontalCard title={"Coming Soon!"} href="#" />
              </div>
            </>
          )}
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
