import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import GenericPractice from "@/components/ui/generic-practice";
import PracticeStartPage from "@/components/ui/practice-start-page";
import ButtonList from "@/components/ui/Quiz/buttonList";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AdminQuizSlot } from "@/types/quiz";

export default function CompetitionQuizPage() {
  // Fetches the quiz data using the custom hook.
  const router = useRouter();
  let { id }: { id?: string | string[] | undefined | Number } = router.query;
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<AdminQuizSlot[]>({
    queryKey: [`quiz.${id}`],
    endpoint: `/quiz/all_quizzes/${id}/slots/`,
  });

  // console.log("Quiz Data: ", quizData);
  // console.log("2024 Quiz Data: ", quizData ? quizData[0] : "No data available");

  /**
   * Handles page change logic.
   * @param {number} page - The new page number.
   */

  const [displayQuiz, setDisplayQuiz] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  let practiceTitle = "Practice Quiz";

  let numberOfQuestions = 16;

  const quizIndex = Number(id);

  if (quizData && !isNaN(quizIndex)) {
    numberOfQuestions = quizData?.length;
  }

  const handleStartQuiz = () => {
    console.log("Start Quiz");
    setDisplayQuiz(true);
    // setTimeLeft(quizDuration * 60 * 1000)
    setTimeLeft(6000); // Set the countdown to 60 seconds (you can change this)
    setIsRunning(true);
  };

  const [timeLeft, setTimeLeft] = useState<number | null>(null); // State for countdown time
  const [isRunning, setIsRunning] = useState(false); // Track if timer is running

  useEffect(() => {
    if (!isRunning || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsRunning(false); // Stop the countdown when time reaches 0
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer on unmount or state change
  }, [timeLeft, isRunning]);

  const handleSubmit = () => {
    setIsSubmitted(true); // Show the popup
  };

  const closePopup = () => {
    setIsSubmitted(false); // Hide the popup
  };

  const tryAgain = () => {
    console.log("Try again");
  };

  return (
    <>
      {isQuizDataLoading ? (
        <div>Loading...</div>
      ) : isQuizDataError ? (
        <div>Error: {QuizDataError?.message}</div>
      ) : !displayQuiz ? (
        <div className="flex flex-col items-center">
          <h1 className="my-4 text-center">{practiceTitle}</h1>
          <PracticeStartPage
            numberOfQuestions={numberOfQuestions}
            onStart={handleStartQuiz}
          />
        </div>
      ) : (
        <div className="">
          <h1 className="my-4 text-center">{practiceTitle}</h1>

          <div className="flex items-center justify-center space-x-2">
            <p>Question Navigation:</p>
            <ButtonList
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalQuestions={numberOfQuestions}
            />
            <Button
              variant="secondary"
              onClick={() => router.push("/quiz/practice/result")}
            >
              Submit
            </Button>
          </div>
          <GenericPractice
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalQuestions={numberOfQuestions}
            questions={quizData ? quizData : []}
          />
        </div>
      )}
    </>
  );
}
