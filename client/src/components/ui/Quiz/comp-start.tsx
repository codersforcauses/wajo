"use client";

import { set } from "date-fns";
import { AlertCircle } from "lucide-react";
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
import { throttle } from "@/lib/utils";
import { Layout } from "@/types/question";
import {
  Competition,
  CompetitionResponse,
  CompetitionSlot,
  GetPagedList,
  QuestionAttempt,
  QuizAttempt,
  QuizAttemptResponse,
} from "@/types/quiz";

const qs111: CompetitionSlot = {
  data: [
    {
      id: 1,
      question: {
        id: 12,
        name: "question1",
        question_text: "wasdf ?",
        images: [{ url: "sss", question: 12 }],
        layout: Layout.LEFT,
      },
      slot_index: 1,
      block: 3,
      quiz: 1,
    },
    {
      id: 1,
      question: {
        id: 12,
        name: "question2",
        question_text: "wasdf2 ?",
        images: [{ url: "sss", question: 12 }],
        layout: Layout.LEFT,
      },
      slot_index: 1,
      block: 3,
      quiz: 1,
    },
  ],
  end_time: new Date(),
};

export function CompStart({
  compId,
  compName,
}: {
  compId: string;
  compName?: string;
}) {
  // Fetch competitoin data (questions)
  // const {
  //     data: quizSlot,
  //     isLoading: isQuizSlotLoading,
  //     isError: isQuizSlotError,
  //     error: quizSlotError,
  // } = useFetchData<CompetitionSlot>({
  //     queryKey: [`quiz.competition.${compId}/slots`],
  //     endpoint: `/quiz/competition/${compId}/slots/`,
  //     retry: 1,
  // });
  // console.log("isLoading", isQuizSlotLoading)
  // console.log("isError", isQuizSlotError)
  // console.log("error", quizSlotError)
  // console.log("data", quizSlot)

  const questions = qs111?.data || [];

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
  const { mutate: saveAnswer, isPending: isSaving } =
    usePostMutation<QuestionAttempt>({
      mutationKey: ["quiz.answer"],
      endpoint: "/quiz/question-attempts/",
      onSuccess: () => {
        setIsSaved(true);
      },
      onError: (err) => {
        console.log("Error saving answer:", err);
      },
    });

  const handleComplete = () => {
    // router.push("/quiz")
  };
  useEffect(() => {
    // console.log("Current answers:", userAnswers)
    // In the future, this could be replaced with:
    // async function saveAnswers() {
    //   try {
    //     const response = await fetch('/api/save-answers', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ answers: userAnswers })
    //     });
    //     const data = await response.json();
    //     console.log('Answers saved:', data);
    //   } catch (error) {
    //     console.error('Error saving answers:', error);
    //   }
    // }w
    // saveAnswers();
  }, [userAnswers]);

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
    const throttledSaveAnswer = throttle(saveAnswer, 1000, timeoutIdRef);

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
      userAnswers[currentQuestion].trim() !== ""
    );
  };
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex w-full items-center gap-4">
        <CardTitle className="flex w-full items-center justify-between">
          <WajoLogo className="mx-4 mt-2 w-20 md:mx-11 md:w-28" />
          <CountdownDisplay
            className="text-sm md:mr-10"
            targetDate={qs111.end_time}
            onComplete={handleComplete}
          ></CountdownDisplay>
        </CardTitle>
      </div>

      <CardTitle>
        {" "}
        {compName} : {currentQuestion + 1}/{questions.length}
      </CardTitle>
      <Card className="mt-3 w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{questions[currentQuestion].question.name}</CardTitle>
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
            questions: qs111,
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
                userAnswers[index].trim() !== "" && !validationErrors[index];
              const hasError =
                userAnswers[index].trim() !== "" && validationErrors[index];

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
