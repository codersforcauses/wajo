import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LatexInput } from "@/components/ui/math-input";
import { usePostMutation } from "@/hooks/use-post-data";
import { backendURL } from "@/lib/api";
import { Layout } from "@/types/question";
import {
  CompetitionSlotData,
  QuestionAnswer,
  QuestionAttempt,
  QuizAttempt,
  QuizAttemptResponse,
} from "@/types/quiz";

interface GenericQuizProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
  slots: CompetitionSlotData[];
  quizAttempt: QuizAttemptResponse;
}

const AUTOSAVE_DELAY = 1000;
const STORAGE_KEY = "quizAnswers";

export default function GenericQuiz({
  currentPage,
  setCurrentPage,
  totalQuestions,
  slots,
  quizAttempt,
}: GenericQuizProps) {
  // Save answer mutation
  const { mutate: saveAnswer, isPending: isSaving } =
    usePostMutation<QuestionAttempt>({
      mutationKey: ["quiz.answer"],
      endpoint: "/quiz/question-attempts/",
      onSuccess: () => {
        setIsSaved(true);
      },
      onError: (err) => {
        toast.error("Failed to save answer");
        console.log("Error saving answer:", err);
      },
    });

  // useEffect(() => {
  //   console.log("quizAttempt", quizAttempt);
  //   // get most recent quiz attempt
  //   if (quizAttempt.results.length > 0) {
  //     const mostRecentAttempt = quizAttempt.results[0];
  //   }
  // }, [quizAttempt]);

  const [answers, setAnswers] = useState<QuestionAnswer[]>(() => {
    try {
      // Refresh any existing localStorage data
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      const parsedAnswers: QuestionAnswer[] = savedAnswers
        ? JSON.parse(savedAnswers)
        : [];
      const completeAnswers = slots.map((s) => {
        const existingAnswer = parsedAnswers.find(
          (a) => a.question === s.question.id,
        );
        return (
          existingAnswer || { question: s.question.id ?? 0, answer_student: "" }
        );
      });
      return completeAnswers;
    } catch (error) {
      console.error("Error loading saved answers:", error);
      return slots.map((s) => ({
        question: s.question.id ?? 0,
        answer_student: "",
      }));
    }
  });

  const [isSaved, setIsSaved] = useState(true);
  const currentQuestion = slots[currentPage - 1].question;

  const saveAnswers = useCallback(
    (newAnswers: QuestionAnswer[]) => {
      // console.log("newAnswers", newAnswers);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
        const currentAnswer = newAnswers.find(
          (a) => a.question === currentQuestion.id,
        );
        // console.log("currentAnswer", currentAnswer);
        if (currentAnswer) {
          saveAnswer({
            student: quizAttempt.results[0].student,
            question: currentAnswer.question,
            answer_student: currentAnswer.answer_student,
            quiz_attempt: quizAttempt ? quizAttempt.results[0].id : null,
            // IntegrityError null value in column "is_correct" of relation "quiz_questionattempt" violates not-null constraint
            is_correct: false,
          });
        }
        // setAnswers(newAnswers);
      } catch (error) {
        console.error("Error saving answers:", error);
        toast.error("Failed to save answers");
      }
    },
    [currentQuestion.id, saveAnswer],
  );

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newAnswer = e.target.value.replace(/[^0-9,\s]/g, ""); // Only allow numbers, commas, and spaces
    setAnswers((prev) => {
      const newAnswers = prev.map((a) =>
        a.question === currentQuestion.id
          ? { ...a, answer_student: e.target.value }
          : a,
      );
      return newAnswers;
    });
    setIsSaved(false);
  };

  useEffect(() => {
    if (!isSaved) {
      const timer = setTimeout(() => {
        saveAnswers(answers);
      }, AUTOSAVE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [answers, isSaved, saveAnswers]);

  const handleNavigation = (direction: "prev" | "next") => {
    if (!isSaved) {
      saveAnswers(answers);
    }

    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalQuestions) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getCurrentAnswer = useCallback(() => {
    // console.log(answers[currentQuestion.id]);
    // console.log("answers: ", answers);
    return (
      answers.find((a) => a.question === currentQuestion.id)?.answer_student ||
      ""
    );
  }, [answers, currentQuestion.id]);

  const renderImage = () => {
    if (currentQuestion.images?.[0]?.url) {
      // console.log(currentQuestion.images[0].url);
      return (
        <div className="my-4">
          <Image
            src={`${backendURL}/${currentQuestion.images[0].url}`}
            alt="Question Image"
            width={400}
            height={200}
            className="h-auto max-h-[30vh] w-auto max-w-[30vw]"
            priority
          />
        </div>
      );
    }
    return "";
  };
  const isHorizontalLayout =
    currentQuestion.layout === Layout.LEFT ||
    currentQuestion.layout === Layout.RIGHT;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="min-h-[16rem] w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
            Question {currentPage}
          </h2>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
            [{currentQuestion.mark}{" "}
            {currentQuestion.mark === 1 ? "Mark" : "Marks"}]
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {currentQuestion.layout === Layout.TOP ? renderImage() : null}

          <div
            className={`flex ${isHorizontalLayout ? "flex-row items-center space-x-4" : "flex-col items-center space-y-4"}`}
          >
            {currentQuestion.layout === Layout.LEFT ? renderImage() : null}
            <LatexInput>{String(currentQuestion.question_text)}</LatexInput>
            {currentQuestion.layout === Layout.RIGHT ? renderImage() : null}
          </div>
          {currentQuestion.layout === Layout.BOTTOM ? renderImage() : null}
        </div>

        <div className="mt-8">
          <h3 className="text-lg text-slate-800 sm:text-xl md:text-2xl">
            Your Answer
          </h3>
          <p className="mb-2 text-sm text-slate-400">
            Must be an integer from 1-999
          </p>
          <div className="space-y-2">
            <input
              type="number"
              value={getCurrentAnswer()}
              onChange={handleAnswerChange}
              placeholder="Enter your answer"
              className="h-10 w-full min-w-64 rounded-sm border border-slate-500 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="h-4">
              {isSaving ? (
                <p className="text-sm text-blue-600">Saving...</p>
              ) : (
                isSaved && (
                  <p className="flex items-center text-sm text-green-600">
                    <span className="mr-1">✓</span> Saved
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleNavigation("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size="lg"
            onClick={() => saveAnswers(answers)}
            disabled={isSaved || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleNavigation("next")}
            disabled={currentPage === totalQuestions}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
