import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import ButtonList from "@/components/ui/buttonList";
import CountdownDisplay from "@/components/ui/CountDownDisplay";
import GenericQuiz from "@/components/ui/generic-quiz";
import Pagination from "@/components/ui/pagination";
import QuizStartPage from "@/components/ui/quiz-start-page";
import SubmissionPopup from "@/components/ui/submissionPopup";
import { useFetchData } from "@/hooks/use-fetch-data";

export default function CompetitionQuizPage() {
  // Fetches the quiz data using the custom hook.
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<Quiz>({
    queryKey: ["quiz.list"],
    endpoint: "/quiz/list",
  });

  // if (isQuizDataLoading) {
  //   return <div>Loading...</div>;
  // }

  // Displays an error message if the API request fails.
  // if (isQuizDataError) {
  //   return <div>Error: {QuizDataError?.message}</div>;
  // }

  // State for the current page number
  // const [currentPage, setCurrentPage] = useState(1);
  /**
   * Handles page change logic.
   * @param {number} page - The new page number.
   */
  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= (quizData?.questions?.length ?? 0)) {
  //     setCurrentPage(page);
  //   }
  // };

  // Tracks the current page number for pagination.
  // const [page, setPage] = useState<number>(1);

  const [displayQuiz, setDisplayQuiz] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const quizTitle = quizData?.name || "Math Competition";
  const questionNumbers = 16;

  const handleStartQuiz = () => {
    console.log("Start Quiz");
    setDisplayQuiz(true);
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
        <div className="flex flex-col items-center border-2 border-orange-600">
          <h1 className="my-4 text-center">{quizTitle}</h1>
          <QuizStartPage onStart={handleStartQuiz} />
        </div>
      ) : (
        <div className="border-2 border-orange-600">
          <h1 className="my-4 text-center">{quizTitle}</h1>

          <div className="my-4 flex justify-center">
            <div>
              <CountdownDisplay timeLeft={timeLeft} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p>Question Navigation:</p>
            <ButtonList
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalQuestions={questionNumbers}
            />
            <Button variant="secondary" onClick={() => setIsSubmitted(true)}>
              Submit
            </Button>
          </div>
          <GenericQuiz
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalQuestions={questionNumbers}
          />
          {isSubmitted && (
            <SubmissionPopup
              popUpStyle="showScore"
              isOpen={isSubmitted}
              onClose={() => setIsSubmitted(false)}
              onTry={() => setDisplayQuiz(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
