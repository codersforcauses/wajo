import { Check, X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface QuestionResultProps {
  question: string;
  questionNumber: number;
  answer: number;
  correctAnswer: number;
  solution: string;
  marks: number;
}

export default function QuestionResult({
  question,
  questionNumber,
  answer,
  correctAnswer,
  solution,
  marks,
}: QuestionResultProps) {
  const isCorrect = answer === correctAnswer;
  return (
    <div className="p-6">
      <div>
        <div className="item-end flex justify-between">
          <h3>Question {questionNumber}</h3>
          <span className="inline-block text-3xl">[{marks} mark]</span>
        </div>
      </div>
      <div className="p-10">
        <div>
          <p>{question}</p>
        </div>
        <div className={isCorrect ? "bg-green-100" : "bg-red-300"}>
          <h5 className="mb-5">Your Answer</h5>
          <div className="flex items-center space-x-2">
            <input
              className={cn(
                "border bg-white p-2 font-sans text-base",
                isCorrect ? "border-green-500" : "border-red-500",
              )}
              type="text"
              disabled
              value={answer}
            />

            {isCorrect ? (
              <Check size={32} className="text-green-500" />
            ) : (
              <X size={32} className="text-red-500" />
            )}
          </div>
        </div>

        <div>
          <h5>Solution</h5>
          <h5 className="p-2 font-sans text-base font-normal">
            {correctAnswer}
          </h5>
          <p>{solution}</p>
        </div>
      </div>
    </div>
  );
}
