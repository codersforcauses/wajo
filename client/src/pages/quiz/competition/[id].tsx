import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import ButtonList from "@/components/ui/Quiz/button-list";
import { CompStart } from "@/components/ui/Quiz/comp-start";
import QuizIntro from "@/components/ui/Quiz/quiz-intro";
import SubmissionPopup from "@/components/ui/submission-popup";
import { useAuth } from "@/context/auth-provider";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePostMutation } from "@/hooks/use-post-data";
import {
  Competition,
  CompetitionResponse,
  CompetitionSlot,
  QuizAttempt,
  QuizAttemptResponse,
  QuizState,
} from "@/types/quiz";

export default function CompetitionQuizPage() {
  const router = useRouter();
  const compId = router.query.id as string;
  const [start, setStart] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEntryClosed, setIsEntryClosed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleStart = () => {
    setStart(true);
  };

  const {
    data: compData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: quizDataError,
  } = useFetchData<Competition>({
    queryKey: [`quiz.competition.${compId}`],
    endpoint: `/quiz/competition/${compId}/`,
    enabled: !!compId, // Only run the query if compId is defined
  });

  const {
    data: quizAttemptData,
    isLoading: isQuizAttemptDataLoading,
    error: quizAttemptDataError,
  } = useFetchData<{
    results: QuizAttempt[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["quizAttemptList"],
    endpoint: `/quiz/quiz-attempts/`,
  });

  const { userId } = useAuth();
  useEffect(() => {
    if (compData) {
      const filteredAttempt = quizAttemptData?.results?.filter(
        (attempt) =>
          attempt.student_user_id === userId &&
          attempt.quiz === compData.id &&
          (attempt.state === QuizState.SUBMITTED ||
            attempt.state === QuizState.COMPLETED),
      );
      if (filteredAttempt?.length === 1) setIsSubmitted(true);
    }
  }, [quizAttemptData, compData]);

  useEffect(() => {
    if (compData) {
      const endTime = new Date(compData.open_time_date);
      endTime.setMinutes(endTime.getMinutes() + compData.time_limit);
      const endWindowTime = new Date(compData.open_time_date);
      endWindowTime.setMinutes(
        endWindowTime.getMinutes() + compData.time_window,
      );
      const now = new Date();
      if (now > endTime) {
        setIsFinished(true);
      } else if (now > endWindowTime) {
        setIsEntryClosed(true);
      }
    }
  }, [compData]);

  if (!compId || !quizAttemptData) return <WaitingLoader />;

  if (!start) {
    return (
      <QuizIntro
        {...{
          quizName: compData?.name,
          quizDuration: compData?.time_limit,
          startTime: compData?.open_time_date,
          timeWindow: compData?.time_window,
          onStart: handleStart,
          isFinished: isFinished,
          isEntryClosed: isEntryClosed,
          isSubmitted: isSubmitted,
        }}
      />
    );
  }
  return <CompStart compId={compId} compName={compData?.name} />;
}
