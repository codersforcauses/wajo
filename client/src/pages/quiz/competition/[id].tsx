import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

import CompetitionLayout from "@/components/competition-layout";
import { Button } from "@/components/ui/button";
import ButtonList from "@/components/ui/Quiz/buttonList";
import CountdownDisplay from "@/components/ui/Quiz/countdown-display";
import GenericQuiz from "@/components/ui/Quiz/generic-quiz";
import QuizStartPage from "@/components/ui/Quiz/quiz-start-page";
import RetrieveQuestion from "@/components/ui/Quiz/retrieve-questions";
import SubmissionPopup from "@/components/ui/submission-popup";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { NextPageWithLayout } from "@/pages/_app";
import { Quiz } from "@/types/quiz";

const CompetitionQuizPage: NextPageWithLayout = () => {
  // Fetches the quiz data using the custom hook.
  const router = useRouter();
  let { id }: { id?: string | string[] | undefined | Number } = router.query;
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<Quiz>({
    queryKey: [`quiz.competition.${id}`],
    endpoint: `/quiz/competition/${id}`,
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

  let quizTitle = "Math Competition";
  let quizStartTime = "2021-09-01T00:00:00.000Z";
  let quizDuration = 100;
  let numberOfQuestions = 16;

  const quizIndex = Number(id);

  if (quizData && !isNaN(quizIndex)) {
    quizTitle = quizData.name;
    quizStartTime = quizData.startTime.toString();
    quizDuration = quizData.duration;
    numberOfQuestions = quizData.questions.length;
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

  return (
    <>
      {isQuizDataLoading ? (
        <div>Loading...</div>
      ) : isQuizDataError ? (
        <div>Error: {QuizDataError?.message}</div>
      ) : !displayQuiz ? (
        <div className="flex flex-col items-center">
          <h1 className="my-4 text-center">{quizTitle}</h1>
          <QuizStartPage
            numberOfQuestions={numberOfQuestions}
            quizDuration={quizDuration}
            startTime={quizStartTime}
            quizName={quizTitle}
            onStart={handleStartQuiz}
          />
        </div>
      ) : (
        <div className="">
          <h1 className="my-4 text-center">{quizTitle}</h1>
          {/* <RetrieveQuestion /> */}

          <div className="my-4 flex justify-center">
            <div>
              <CountdownDisplay timeLeft={timeLeft} />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <p>Question Navigation:</p>
            <ButtonList
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalQuestions={numberOfQuestions}
            />
            <Button variant="secondary" onClick={() => setIsSubmitted(true)}>
              Submit
            </Button>
          </div>
          <GenericQuiz
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalQuestions={numberOfQuestions}
            questions={quizData ? quizData?.questions : []}
          />
          {isSubmitted && (
            <SubmissionPopup
              popUpStyle="showSubmit"
              isOpen={isSubmitted}
              onClose={() => setIsSubmitted(false)}
              onTry={() => setDisplayQuiz(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

CompetitionQuizPage.getLayout = (page: ReactElement) => {
  return <CompetitionLayout>{page}</CompetitionLayout>;
};

export default CompetitionQuizPage;
