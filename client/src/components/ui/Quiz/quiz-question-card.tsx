import { AlertCircle } from "lucide-react";
import Image from "next/image";

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
import { LatexInput } from "@/components/ui/math-input";
import { backendURL } from "@/lib/api";
import { Question } from "@/types/question";
import {
  Competition,
  CompetitionResponse,
  CompetitionSlot,
  CompetitionSlotData,
  QuizAttempt,
  QuizAttemptResponse,
} from "@/types/quiz";

interface QuizQuestionCardProps {
  questions: CompetitionSlot | undefined;
  currentQuestion: number;
  userAnswers: string[];
  validationErrors: string[];
  handleAnswerChange: (value: string) => void;
  isSaved: boolean;
}

export default function QuizQuestionCard({
  questions,
  currentQuestion,
  userAnswers,
  handleAnswerChange,
  validationErrors,
  isSaved,
}: QuizQuestionCardProps) {
  const imageURL =
    questions?.data[currentQuestion]?.question?.images?.[0]?.url ?? "";
  return (
    <CardContent>
      <div className="space-y-6">
        <div className="flex w-full flex-col content-between items-baseline justify-between text-sm md:text-base">
          <LatexInput className=" ">
            {String(questions?.data[currentQuestion].question.question_text)}
          </LatexInput>
          {imageURL && (
            <div className="my-4">
              <Image
                src={`${backendURL}/${imageURL}`}
                alt="Question Image"
                width={400}
                height={300}
                className="h-auto max-h-[30vh] w-auto max-w-[30vw]"
                priority
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">
            Your answer (only input one answer if you think there's many) :
          </Label>
          <div className="relative">
            <Input
              id="answer"
              value={userAnswers[currentQuestion] || ""} // Ensure a fallback value
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Enter a number between 0 and 999"
              className={`w-full ${validationErrors[currentQuestion] ? "border-red-600 pr-10" : ""}`}
              min="0"
              max="999"
            />
            {validationErrors[currentQuestion] && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {validationErrors[currentQuestion] && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors[currentQuestion]}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  );
}
