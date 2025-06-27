import Link from "next/link";
import React from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WaitingLoader } from "@/components/ui/loading";
import { useFetchData } from "@/hooks/use-fetch-data";
import { QuizResponse } from "@/types/quiz";

function PracticePage() {
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<QuizResponse>({
    queryKey: ["quizzes.all"],
    endpoint: "/quiz/all-quizzes/",
  });

  if (isQuizDataLoading || !quizData) return <WaitingLoader />;
  if (isQuizDataError) return <div>Error: {QuizDataError?.message}</div>;

  return (
    <PublicPage>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Past Questions and Solutions
          </h1>
          <p className="text-gray-600">
            Choose a practice quiz to start practicing. No login required!
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizData.results.map((quiz) => (
            <Card key={quiz.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{quiz.name}</CardTitle>
                <CardDescription className="text-sm">
                  {quiz.intro}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Marks: {parseInt(quiz.total_marks)}</span>
                  <span>Time Limit: {quiz.time_limit} min</span>
                </div>
                <Link
                  href={`/wajo/practice-questions?quizId=${quiz.id}`}
                  className="w-full"
                >
                  <Button className="w-full" variant="default">
                    Start Practice
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizData.results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              No practice quizzes available at the moment.
            </p>
          </div>
        )}
      </div>
    </PublicPage>
  );
}

export default PracticePage;
