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
} from "@/types/quiz";

export default function CompetitionQuizPage() {
  const router = useRouter();
  const compId = router.query.id as string;
  const [start, setStart] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const handleStart = () => {
    setStart(true);
    // console.log(compId);
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

  useEffect(() => {
    if (compData) {
      const endTime = new Date(compData.open_time_date);
      endTime.setMinutes(endTime.getMinutes() + compData.time_limit);
      const now = new Date();
      if (now > endTime) {
        setIsFinished(true);
      }
    }
  }, [compData]);

  if (!compId) return <WaitingLoader />;

  console.log(compId);
  if (!start) {
    return (
      <QuizIntro
        {...{
          quizName: compData?.name,
          quizDuration: compData?.time_limit,
          startTime: compData?.open_time_date,
          onStart: handleStart,
          isFinished: isFinished,
        }}
      />
    );
  }
  return <CompStart compId={compId} compName={compData?.name} />;
}
