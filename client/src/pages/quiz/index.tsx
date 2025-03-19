"use client";

import { createContext, useContext, useEffect } from "react";

import { PublicPage } from "@/components/layout";
import { WaitingLoader } from "@/components/ui/loading";
import {
  CompetitionCard,
  NoCompetitionCard,
  PracticeCard,
} from "@/components/ui/Quiz/quiz-cards";
import { useFetchData } from "@/hooks/use-fetch-data";
import { CompetitionResponse, QuizResponse } from "@/types/quiz";

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
    endpoint: "/quiz/all-quizzes/",
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

  if (isQuizDataLoading || !quizData || isCompQuizDataLoading || !compQuizData)
    return <WaitingLoader />;
  if (isQuizDataError) return <div>Error Quiz: {QuizDataError?.message}</div>;
  if (isCompQuizDataError)
    return <div>Error Competition: {compQuizDataError?.message}</div>;

  return (
    <div className="md:grid-cols mx-1 my-20 mt-10 grid auto-rows-min gap-4">
      {compQuizData.results.length > 0 ? (
        <CompetitionCard
          className="mx-auto w-full max-w-lg"
          {...compQuizData}
        />
      ) : (
        <NoCompetitionCard className="mx-auto w-full max-w-lg" />
      )}
      <PracticeCard className="mx-auto w-full max-w-lg" {...quizData} />
    </div>
  );
};
