import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { backendURL } from "@/lib/api";
import { AdminQuizSlot, Quiz } from "@/types/quiz";

interface PracticeResults {
  quizId: string | string[];
  userAnswers: string[];
  questions: AdminQuizSlot[];
  quizData: Quiz;
  submittedAt: string;
}

function PracticeResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PracticeResults | null>(null);
  const [score, setScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem("practiceResults");
    if (storedResults) {
      const parsedResults: PracticeResults = JSON.parse(storedResults);
      setResults(parsedResults);
      let earnedScore = 0;
      let total = 0;
      parsedResults.questions.forEach((question, index) => {
        const userAnswer = parsedResults.userAnswers[index]?.trim() || "";
        const correctAnswerValues = question.question.answers.map((answer) =>
          answer.value.toString(),
        );

        total += question.question.mark;

        if (correctAnswerValues.includes(userAnswer)) {
          earnedScore += question.question.mark;
        }
      });

      setScore(earnedScore);
      setTotalMarks(total);
    } else {
      // No results found, redirect back to practice page
      router.push("/wajo/practice");
    }
  }, [router]);

  const handleRetry = () => {
    if (results) {
      router.push(`/wajo/practice-questions?quizId=${results.quizId}`);
    }
  };

  const handleBackToPractice = () => {
    router.push("/wajo/practice");
  };

  const isAnswerCorrect = (questionIndex: number): boolean => {
    if (!results) return false;

    const userAnswer = results.userAnswers[questionIndex]?.trim() || "";
    const correctAnswers = results.questions[
      questionIndex
    ].question.answers.map((answer) => answer.value.toString());

    return correctAnswers.includes(userAnswer);
  };

  const getCorrectAnswers = (questionIndex: number): string => {
    if (!results) return "";

    return results.questions[questionIndex].question.answers
      .map((answer) => answer.value.toString())
      .join(", ");
  };

  if (!results) {
    return (
      <PublicPage>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">No Results Found</h1>
          <p className="mb-4 text-gray-600">
            No practice results were found. Please complete a practice quiz
            first.
          </p>
          <Link href="/wajo/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </PublicPage>
    );
  }

  return (
    <PublicPage>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Practice Results
          </h1>
          <h2 className="mb-4 text-xl text-gray-600">
            {results.quizData.name}
          </h2>

          <Card className="mx-auto max-w-md bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="text-2xl">Your Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-4xl font-bold text-blue-600">
                {score} / {totalMarks}
              </div>
              <div className="text-lg text-gray-600">
                {((score / totalMarks) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 flex justify-center space-x-4">
          <Button onClick={handleRetry} variant="default">
            Try Again
          </Button>
          <Button onClick={handleBackToPractice} variant="outline">
            Back to Practice
          </Button>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h3 className="mb-6 text-center text-2xl font-bold">
            Detailed Solutions
          </h3>

          {results.questions.map((questionSlot, index) => {
            const isCorrect = isAnswerCorrect(index);
            const userAnswer =
              results.userAnswers[index]?.trim() || "No answer";
            const correctAnswers = getCorrectAnswers(index);

            return (
              <Card key={questionSlot.id} className="mx-auto max-w-4xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-normal text-gray-600">
                        {questionSlot.question.mark} mark
                        {questionSlot.question.mark !== 1 ? "s" : ""}
                      </span>
                      <div
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-lg font-semibold">Question:</h4>
                    <p className="leading-relaxed text-gray-700">
                      {questionSlot.question.question_text}
                    </p>
                  </div>

                  {questionSlot.question.images &&
                    questionSlot.question.images.length > 0 && (
                      <div className="flex justify-center">
                        <Image
                          src={`${backendURL}${questionSlot.question.images[0].url}`}
                          alt="Question diagram"
                          width={400}
                          height={300}
                          className="h-auto max-w-full rounded-lg shadow-md"
                        />
                      </div>
                    )}

                  <div>
                    <h4 className="mb-2 text-lg font-semibold">Your Answer:</h4>
                    <div
                      className={`rounded-lg border-2 p-3 ${
                        isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <span className="font-mono text-lg">{userAnswer}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-lg font-semibold">
                      Correct Answer
                      {questionSlot.question.answers.length > 1 ? "s" : ""}:
                    </h4>
                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-3">
                      <span className="font-mono text-lg text-green-800">
                        {correctAnswers}
                      </span>
                    </div>
                  </div>

                  {questionSlot.question.solution_text && (
                    <div>
                      <h4 className="mb-2 text-lg font-semibold">Solution:</h4>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="leading-relaxed text-gray-700">
                          {questionSlot.question.solution_text}
                        </p>
                      </div>
                    </div>
                  )}

                  {questionSlot.question.note && (
                    <div>
                      <h4 className="mb-2 text-lg font-semibold">Note:</h4>
                      <div className="bg-yellow-50 border-yellow-200 rounded-lg border p-3">
                        <p className="leading-relaxed text-gray-700">
                          {questionSlot.question.note}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center space-x-4">
          <Button onClick={handleRetry} variant="default" size="lg">
            Try Again
          </Button>
          <Button onClick={handleBackToPractice} variant="outline" size="lg">
            Back to Practice
          </Button>
        </div>
      </div>
    </PublicPage>
  );
}

export default PracticeResultsPage;
