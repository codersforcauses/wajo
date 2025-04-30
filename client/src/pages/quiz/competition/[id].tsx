import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import ButtonList from "@/components/ui/Quiz/button-list";
import CountdownDisplay from "@/components/ui/Quiz/countdown-display";
import GenericQuiz from "@/components/ui/Quiz/generic-quiz";
import QuizStartPage from "@/components/ui/Quiz/quiz-start-page";
import SubmissionPopup from "@/components/ui/submission-popup";
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePostMutation } from "@/hooks/use-post-data";
import {
  Competition,
  CompetitionSlot,
  QuizAttempt,
  QuizAttemptResponse,
} from "@/types/quiz";

export default function CompetitionQuizPage() {
  const router = useRouter();
  const compId = parseInt(router.query.id as string);
  const { primaryId } = useAuth();
  const [quizState, setQuizState] = useState({
    isDisplayQuiz: false,
    isQuizAttempt: false,
    isSubmitted: false,
    currentPage: 1,
    timeLeft: null as number | null,
    isRunning: false,
  });

  // Fetch quiz data
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: quizDataError,
  } = useFetchData<Competition>({
    queryKey: [`quiz.competition.${compId}`],
    endpoint: `/quiz/competition/${compId}/`,
    enabled: !isNaN(compId),
  });

  // Fetch quiz slots (questions) only when quiz starts
  const {
    data: quizSlot,
    isLoading: isQuizSlotLoading,
    isError: isQuizSlotError,
    error: quizSlotError,
  } = useFetchData<CompetitionSlot>({
    queryKey: [`quiz.competition.${compId}/slots`],
    endpoint: `/quiz/competition/${compId}/slots/`,
    enabled: !!quizData && quizState.isDisplayQuiz,
    retry: 1,
  });

  // Fetch quiz (attempts) only when quiz starts
  const {
    data: quizAttemptData,
    isLoading: isQuizAttemptDataLoading,
    isError: isQuizAttemptDataError,
    error: quizAttemptError,
  } = useFetchData<QuizAttemptResponse>({
    queryKey: [`quiz.quiz-attempts.${compId}.${primaryId}`],
    endpoint: `/quiz/quiz-attempts/?state=2`,
    enabled: !!quizSlot && quizState.isDisplayQuiz,
  });

  // if no quiz attempt data, create a new quiz attempt
  const { mutate: createQuizAttempt } = usePostMutation<QuizAttempt>({
    mutationKey: [`quiz.quiz-attempts.${compId}.${primaryId}`],
    endpoint: `/quiz/quiz-attempts/`,
    onSuccess: (data) => {
      setQuizState((prev) => ({
        ...prev,
        isQuizAttempt: true,
      }));
      toast.success("Quiz attempt created successfully");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to create quiz attempt.",
      );
    },
  });

  // Submit quiz
  const { data, isLoading, isError, error, isSuccess } = useFetchData<{
    message: string;
  }>({
    queryKey: [
      `quiz.quiz-attempts.${quizSlot?.quiz_attempt_id}.submit.${compId}.${primaryId}`,
    ],
    endpoint: `/quiz/quiz-attempts/${quizSlot?.quiz_attempt_id}/submit/`,
    enabled: !!quizSlot && quizState.isSubmitted,
  });

  const calculateTimeLeft = () => {
    if (!quizSlot) return 0;
    const now = new Date();
    const endTime = new Date(quizSlot.end_time);
    return Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
  };

  useEffect(() => {
    console.log("Quiz Attempt Data: ", quizAttemptData);
    if (quizAttemptData && quizAttemptData.results.length > 0) {
      setQuizState((prev) => ({ ...prev, isQuizAttempt: true }));
    }
  }, [quizAttemptData]);

  useEffect(() => {
    // Check if quizAttemptData is empty and create a new quiz attempt if necessary
    if (
      quizState.isDisplayQuiz &&
      !quizAttemptData &&
      !isQuizAttemptDataLoading
    ) {
      console.log("No quiz attempt found. Creating a new quiz attempt...");
      createQuizAttempt({
        quiz: compId, // The current quiz ID
        student: primaryId, // The current student's ID
      });
      setQuizState((prev) => ({ ...prev, isQuizAttempt: true }));
    }
  }, [quizAttemptData, quizState.isDisplayQuiz, isQuizAttemptDataLoading]);

  useEffect(() => {
    setQuizState((prev) => ({ ...prev, timeLeft: calculateTimeLeft() }));
  }, [quizState.isDisplayQuiz, quizSlot]);

  useEffect(() => {
    if (!quizState.isRunning || quizState.timeLeft === null) return;

    if (quizSlot && quizState.timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setQuizState((prev) => ({
        ...prev,
        timeLeft: prev.timeLeft !== null ? prev.timeLeft - 1 : 0,
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [quizState.timeLeft, quizState.isRunning]);

  const handleStartQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      isDisplayQuiz: true,
      isRunning: true,
    }));
  };

  const handleSubmit = async () => {
    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      isRunning: false,
    }));
  };

  const getErrorResponse = (
    err: AxiosError<{ error: string; message: string }>,
  ) => {
    return (
      err?.response?.data?.error ||
      err?.message ||
      "Failed to get error message."
    );
  };

  // load quiz data
  if (isQuizDataLoading) return <WaitingLoader />;
  if (isQuizDataError)
    return <div>Error loading quiz: {getErrorResponse(quizDataError)}</div>;
  if (!quizData) return <div>Quiz not found</div>;
  // load quiz slot (questions)
  if (quizState.isDisplayQuiz && isQuizSlotLoading) return <WaitingLoader />;
  if (quizState.isDisplayQuiz && isQuizSlotError)
    return (
      <div>Error loading questions: {getErrorResponse(quizSlotError)}</div>
    );
  if (quizSlot && quizSlot.data.length < 1)
    return <div>Questions not found</div>;
  // load student quiz (attempt)
  if (quizState.isQuizAttempt && isQuizAttemptDataLoading)
    return <WaitingLoader />;
  if (quizState.isQuizAttempt && isQuizAttemptDataError)
    return (
      <div>
        Error loading quiz attempt: {getErrorResponse(quizAttemptError)}
      </div>
    );

  const {
    name: quizTitle,
    open_time_date: quizStartTime,
    time_limit: quizDuration,
  } = quizData;
  const numberOfQuestions = quizSlot?.data.length ?? 0;

  return (
    <div className="container mx-auto px-4">
      <h1 className="my-4 text-center text-2xl font-bold">{quizTitle}</h1>
      {!quizState.isDisplayQuiz ? (
        <QuizStartPage
          numberOfQuestions={numberOfQuestions}
          quizDuration={quizDuration}
          startTime={quizStartTime}
          quizName={quizTitle}
          onStart={handleStartQuiz}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <CountdownDisplay timeLeft={quizState.timeLeft} />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <p>Question Navigation:</p>
            <ButtonList
              currentPage={quizState.currentPage}
              setCurrentPage={(page) =>
                setQuizState((prev) => ({ ...prev, currentPage: page }))
              }
              totalQuestions={numberOfQuestions}
            />
            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {quizSlot && quizAttemptData && (
            <GenericQuiz
              currentPage={quizState.currentPage}
              setCurrentPage={(page) =>
                setQuizState((prev) => ({ ...prev, currentPage: page }))
              }
              totalQuestions={numberOfQuestions}
              slots={quizSlot.data}
              quizAttempt={quizAttemptData}
            />
          )}

          {quizState.isSubmitted && (
            <SubmissionPopup
              popUpStyle="showSubmit"
              isOpen={quizState.isSubmitted}
              onClose={() => {
                router.push("/quiz");
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
