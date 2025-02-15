import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import Latex from "react-latex-next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePostMutation } from "@/hooks/use-post-data";
import { Layout } from "@/types/question";
import {
  CompetitionSlotData,
  QuestionAnswer,
  QuestionAttempt,
  QuizAttempt,
} from "@/types/quiz";

interface GenericQuizProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
  slots: CompetitionSlotData[];
  quizAttempt: QuizAttempt;
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
      onError: () => {
        toast.error("Failed to save answer");
      },
    });

  const [answers, setAnswers] = useState<QuestionAnswer[]>(() => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      return savedAnswers
        ? JSON.parse(savedAnswers)
        : slots.map((s) => ({ question: s.question.id, answer_student: "" }));
    } catch (error) {
      console.error("Error loading saved answers:", error);
      return slots.map((s) => ({
        question: s.question.id,
        answer_student: "",
      }));
    }
  });

  const [isSaved, setIsSaved] = useState(true);
  const currentQuestion = slots[currentPage - 1].question;

  const saveAnswers = useCallback(
    (newAnswers: QuestionAnswer[]) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnswers));
        const currentAnswer = newAnswers.find(
          (a) => a.question === currentQuestion.id,
        );
        if (currentAnswer) {
          saveAnswer({
            student: quizAttempt.student,
            question: currentAnswer.question,
            answer_student: currentAnswer.answer_student,
            quiz_attempt: quizAttempt.id,
            // IntegrityError null value in column "is_correct" of relation "quiz_questionattempt" violates not-null constraint
            is_correct: false,
          });
        }
      } catch (error) {
        console.error("Error saving answers:", error);
        toast.error("Failed to save answers");
      }
    },
    [currentQuestion.id, quizAttempt.id, saveAnswer],
  );

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value.replace(/[^0-9,\s]/g, ""); // Only allow numbers, commas, and spaces
    setAnswers((prev) => {
      const newAnswers = prev.map((a) =>
        a.question === currentQuestion.id
          ? { ...a, answer_student: newAnswer }
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
    return (
      answers.find((a) => a.question === currentQuestion.id)?.answer_student ||
      ""
    );
  }, [answers, currentQuestion.id]);

  const renderImage = () => {
    console.log(currentQuestion.images[0].url);
    if (currentQuestion.images?.[0]?.url) {
      return (
        <div className="my-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL_BASE}/${currentQuestion.images[0].url}`}
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
            <div className="flex h-auto w-auto items-center justify-center text-pretty p-4">
              <Latex>{currentQuestion.question_text}</Latex>
            </div>
            {currentQuestion.layout === Layout.RIGHT ? renderImage() : null}
          </div>
          {currentQuestion.layout === Layout.BOTTOM ? renderImage() : null}
        </div>

        <div className="mt-8">
          <h3 className="text-lg text-slate-800 sm:text-xl md:text-2xl">
            Your Answer
          </h3>
          <p className="mb-2 text-sm text-slate-400">
            Must be an integer from 1-999, use "," to separate multiple answers
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={getCurrentAnswer()}
              onChange={handleAnswerChange}
              placeholder="Enter your answer"
              className="h-10 w-full min-w-64 rounded-sm border border-slate-500 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              pattern="[0-9,\s]*"
              title="Please enter numbers separated by commas"
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
