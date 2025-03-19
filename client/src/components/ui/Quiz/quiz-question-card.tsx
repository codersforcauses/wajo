import { AlertCircle, Save } from "lucide-react";

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
  questions: CompetitionSlot;
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
  return (
    <CardContent>
      <div className="space-y-6">
        <h3 className="flex content-between justify-between text-xl font-medium">
          {questions.data[currentQuestion].question.question_text}
          {isSaved ? (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Save /> Saved{" "}
            </span>
          ) : null}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="answer">
            Your answer (only input one answer if you think there's many) :
          </Label>
          <div className="relative">
            <Input
              id="answer"
              value={userAnswers[currentQuestion]}
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
