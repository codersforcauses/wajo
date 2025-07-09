import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WaitingLoader } from "@/components/ui/loading";
import { LatexInput } from "@/components/ui/math-input";
import PracticeStartPage from "@/components/ui/practice-start-page";
import ButtonList from "@/components/ui/Quiz/button-list";
import { useFetchData } from "@/hooks/use-fetch-data";
import { backendURL } from "@/lib/api";
import { AdminQuizSlot, Quiz } from "@/types/quiz";

export default function PracticeQuestionsPage() {
  const router = useRouter();
  const { quizId } = router.query;
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: quizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
    error: quizError,
  } = useFetchData<Quiz>({
    queryKey: [`quiz`, quizId],
    endpoint: `/quiz/all-quizzes/${quizId}/`,
    enabled: !!quizId,
  });

  const {
    data: quizSlots,
    isLoading: isSlotsLoading,
    isError: isSlotsError,
    error: slotsError,
  } = useFetchData<AdminQuizSlot[]>({
    queryKey: [`quiz`, quizId, "slots"],
    endpoint: `/quiz/all-quizzes/${quizId}/slots/`,
    enabled: !!quizId,
  });

  // Initialize answers when questions are loaded
  useEffect(() => {
    if (quizSlots) {
      setUserAnswers(new Array(quizSlots.length).fill(""));
    }
  }, [quizSlots]);

  // remove the localStorage when first loaded
  useEffect(() => {
    localStorage.removeItem("practiceResults");
  }, []);

  // Reset states when quiz changes
  useEffect(() => {
    setHasStarted(false);
    setCurrentPage(1);
    setUserAnswers([]);
    setTimeLeft(null);
    setIsRunning(false);
  }, [quizId]);

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  const handleStartQuiz = () => {
    setHasStarted(true);
    if (quizData) {
      setTimeLeft(quizData.time_limit * 60);
      setIsRunning(true);
    }
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentPage - 1] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const results = {
      quizId,
      userAnswers,
      questions: quizSlots,
      quizData,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("practiceResults", JSON.stringify(results));
    router.push("/quiz/practice-results");
  };

  const handleNext = () => {
    if (currentPage < (quizSlots?.length || 0)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isQuizLoading || isSlotsLoading) return <WaitingLoader />;
  if (isQuizError) return <div>Error loading quiz: {quizError?.message}</div>;
  if (isSlotsError)
    return <div>Error loading questions: {slotsError?.message}</div>;
  if (!quizData || !quizSlots) return <div>Quiz not found</div>;

  if (!hasStarted) {
    return (
      <PublicPage>
        <div className="flex flex-col items-center py-8">
          <PracticeStartPage
            numberOfQuestions={quizSlots.length}
            onStart={handleStartQuiz}
            PracticeName={quizData.name}
          />
        </div>
      </PublicPage>
    );
  }

  const currentQuestion = quizSlots[currentPage - 1];

  return (
    <PublicPage>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{quizData.name}</h1>
            {timeLeft !== null && (
              <div className="rounded bg-red-100 px-3 py-1 font-mono text-lg">
                Time: {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="mb-4 flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600">Question Navigation:</span>
            <ButtonList
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalQuestions={quizSlots.length}
            />
            <Button
              variant="destructive"
              onClick={handleSubmit}
              className="ml-4"
            >
              Submit
            </Button>
          </div>
        </div>

        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {currentPage}</span>
              <span className="text-sm font-normal text-gray-600">
                {currentQuestion.question.mark} mark
                {currentQuestion.question.mark !== 1 ? "s" : ""}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed">
              <LatexInput>{currentQuestion.question.question_text}</LatexInput>
            </div>

            {currentQuestion.question.images &&
              currentQuestion.question.images.length > 0 && (
                <div className="flex justify-center">
                  <Image
                    src={`${backendURL}${currentQuestion.question.images[0].url}`}
                    alt="Question diagram"
                    width={400}
                    height={300}
                    className="h-auto max-w-full rounded-lg shadow-md"
                  />
                </div>
              )}

            <div className="space-y-2">
              <Label htmlFor="answer" className="text-base font-medium">
                Your Answer:
              </Label>
              {currentQuestion.question.layout &&
              currentQuestion.question.layout.toLowerCase().includes("math") ? (
                <div className="space-y-2">
                  <textarea
                    value={userAnswers[currentPage - 1] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your mathematical answer (LaTeX supported)..."
                    className="w-full rounded-md border p-3 text-lg"
                    rows={3}
                  />
                </div>
              ) : (
                <Input
                  id="answer"
                  type="text"
                  value={userAnswers[currentPage - 1] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Enter your answer..."
                  className="p-3 text-lg"
                />
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentPage === quizSlots.length}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
