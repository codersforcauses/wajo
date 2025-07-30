"use client";
import { set } from "date-fns";
import { AlertCircle, Save } from "lucide-react";
import { useRouter } from "next/router";
import { use, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CountdownDisplay from "@/components/ui/Quiz/countdown-timer";
import QuizQuestionCard from "@/components/ui/Quiz/quiz-question-card";
import WajoLogo from "@/components/wajo-logo";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePostMutation } from "@/hooks/use-post-data";
import api from "@/lib/api";
import { useThrottle } from "@/lib/utils";
import { Layout } from "@/types/question";
import {
  Competition,
  CompetitionResponse,
  CompetitionSlot,
  CompetitionSubmitResponse,
  GetPagedList,
  QuestionAttempt,
  QuizAttempt,
  QuizAttemptResponse,
} from "@/types/quiz";

export function CompStart({
  compId,
  compName,
}: {
  compId: string;
  compName?: string;
}) {
  const {
    data: question_slots,
    isLoading,
    error,
  } = useFetchData<CompetitionSlot>({
    queryKey: ["competition-slots", compId],
    endpoint: "/quiz/competition/" + compId + "/slots/",
  });

  const questions = question_slots?.data || [];
  const endTime = question_slots?.end_time || null; // Ensure endTime is null if not available

  const { data: questionAttempts } = useFetchData<
    GetPagedList<QuestionAttempt>
  >({
    queryKey: ["quiz.question-attempts"],
    endpoint: `/quiz/question-attempts/`,
  });

  const [currentQuestion, setCurrentQuestion] = useState(0); // Index of the current question
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [validationErrors, setValidationErrors] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize userAnswers with pre-filled answers from questionAttempts
  useEffect(() => {
    if (questions.length > 0 && questionAttempts?.results) {
      const prefilledAnswers = questions.map((question) => {
        const attempt = questionAttempts.results.find(
          (attempt) => attempt.question === question.question.id,
        );
        return attempt ? attempt.answer_student.toString() : ""; // Default to empty if no answer
      });
      setUserAnswers(prefilledAnswers);
    }
  }, [questions, questionAttempts]);

  const { mutate: saveAnswer, isPending: isSaving } =
    usePostMutation<QuestionAttempt>({
      mutationKey: ["quiz.answer"],
      endpoint: "/quiz/question-attempts/",
      onSuccess: () => {
        setIsSaved(true); // Set isSaved to true after successful save
      },
      onError: (err) => {
        console.log("Error saving answer:", err);
      },
    });

  const handleComplete = () => {
    // router.push("/quiz")
  };

  const validateAnswer = (answer: string): string => {
    if (answer.trim() === "") {
      return ""; // Empty is allowed, but will be considered invalid for navigation
    }

    // Check if it's a valid integer
    if (!/^\d+$/.test(answer)) {
      return "Please enter a valid integer";
    }

    // Check if it's within range
    const num = Number.parseInt(answer, 10);
    if (num < 0 || num > 999) {
      return "Please enter a number between 0 and 999";
    }

    return ""; // No error
  };
  const throttledSaveAnswer = useThrottle(saveAnswer, 1000, timeoutIdRef);
  const handleAnswerChange = (answer: string) => {
    // 1.Update the answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    // 2.Validate the answer
    const error = validateAnswer(answer);
    // 3. handle the '01, 02' case
    if (!error && answer.trim() !== "") {
      newAnswers[currentQuestion] = Number.parseInt(answer, 10).toString();
      // re-set the answer
      setUserAnswers(newAnswers);
    }
    const newErrors = [...validationErrors];
    newErrors[currentQuestion] = error;
    setValidationErrors(newErrors);
    if (error) return;
    // Log the answer for the current question
    setIsSaved(false);
    throttledSaveAnswer({
      question: questions[currentQuestion].question.id,
      answer_student: answer,
      quiz_attempt: question_slots?.quiz_attempt_id,
    });

    // throttledLog(`Question ${currentQuestion + 1} answer:`, answer)
  };

  // const throttledHandleAnswerChange = throttle(handleAnswerChange, 1000)

  const handleNext = () => {
    // Validate current answer before proceeding
    const currentError = validateAnswer(userAnswers[currentQuestion]);
    if (currentError) {
      const newErrors = [...validationErrors];
      newErrors[currentQuestion] = currentError;
      setValidationErrors(newErrors);
      return; // Don't proceed if there's an error
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit the answers

      // TODO: Submit the answers
      // Log final answers before showing results
      // popup to make sure student want to submit
      if (
        window.confirm(
          "Are you sure you want to submit? You won't be able to change your answers after this.",
        )
      ) {
        api
          .get(`/quiz/competition/${compId}/submit/`)
          .then((response) => {
            console.log("Submission successful:", response.data);
          })
          .catch((error) => {
            console.error("Error during submission:", error);
          });
        window.alert("Your answers have been submitted successfully.");
        // refresh the page to get the latest data
        window.location.href = "/quiz";
      }
      console.log("Final answers:", userAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isCurrentAnswerValid = () => {
    return (
      !validationErrors[currentQuestion] &&
      userAnswers[currentQuestion]?.trim() !== ""
    );
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex w-full items-center gap-4">
        <CardTitle className="flex w-full items-center justify-between">
          <WajoLogo className="mx-4 mt-2 w-20 md:mx-11 md:w-28" />
          {endTime && ( // Render CountdownDisplay only if endTime is valid
            <CountdownDisplay
              className="text-sm md:mr-10"
              targetDate={endTime}
              onComplete={handleComplete}
            />
          )}
        </CardTitle>
      </div>

      <CardTitle>
        {" "}
        {compName} : {currentQuestion + 1}/{questions.length}
      </CardTitle>
      <Card className="mt-3 w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{questions[currentQuestion]?.question.name}</CardTitle>
            {isSaved ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Save /> Saved{" "}
              </span>
            ) : null}
            <div className="text-sm text-muted-foreground">
              Answered:{" "}
              {
                userAnswers.filter(
                  (a, i) => a.trim() !== "" && !validationErrors[i],
                ).length
              }
              /{questions.length}
            </div>
          </div>
        </CardHeader>
        <QuizQuestionCard
          {...{
            questions: question_slots,
            handleAnswerChange,
            currentQuestion,
            userAnswers,
            validationErrors,
            isSaved,
          }}
        />

        {/* Question navigation buttons */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap justify-center gap-2">
            {questions.map((_, index) => {
              const isAnswered =
                userAnswers[index]?.trim() !== "" &&
                !validationErrors[index] &&
                userAnswers[index] !== undefined;
              // console.log("isAnswered", isAnswered);
              const hasError =
                userAnswers[index]?.trim() !== "" && validationErrors[index];

              return (
                <Button
                  key={index}
                  variant={
                    currentQuestion === index
                      ? "default"
                      : isAnswered
                        ? "outline"
                        : "ghost"
                  }
                  size="sm"
                  className={`h-10 w-10 font-bold ${
                    currentQuestion === index
                      ? "bg-primary"
                      : isAnswered
                        ? "border-2 border-green-700 text-green-700"
                        : hasError
                          ? "border-2 border-red-500 text-red-500"
                          : "border-2"
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </div>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!isCurrentAnswerValid()}>
            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
