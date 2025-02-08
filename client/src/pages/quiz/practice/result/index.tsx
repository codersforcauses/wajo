import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import QuestionResult from "@/components/ui/Practice/question-result";

export default function Result() {
  const router = useRouter();

  const questions = [
    {
      question:
        "The regular hexagon ABCDEF shown, has area 24. What is the area of △ABD?",
      questionNumber: 1,
      answer: 6,
      correctAnswer: 8,
      solution: `Let O be the centre of the hexagon. Diagonals AD, BE and CF pass through O and partition ABCDEF into six congruent equilateral triangles, each of area 24/6 = 4. Observe that BD partitions each of △BCO and △CDO into two triangles of equal area.`,
      marks: 1,
    },
    {
      question:
        "The regular hexagon ABCDEF shown, has area 24. What is the area of △ABD?",
      questionNumber: 2,
      answer: 8,
      correctAnswer: 8,
      solution: `Same as above solution.`,
      marks: 1,
    },
  ];

  return (
    <div>
      <div className="relative mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="ml-4 mt-4 border border-black p-2 px-6 py-3 text-lg hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 transform text-2xl font-bold">
          Result
        </h1>
      </div>

      <div className="mb-8 text-center">
        <div className="mt-4 inline-block rounded-lg border border-black px-6 py-2 text-4xl font-bold">
          95/100
        </div>
        <p className="mt-2 text-gray-500">mm... not bad :)</p>
      </div>

      <div className="mx-auto bg-yellow px-4 py-2 text-center text-2xl font-semibold">
        Solutions
      </div>

      <div>
        {questions.map((q, index) => (
          <QuestionResult key={index} {...q} />
        ))}
      </div>

      <div className="mx-auto mb-10 flex justify-center space-x-4">
        <Button
          className="w-1/4 border border-black bg-white text-lg"
          onClick={() => router.push("/quiz")}
        >
          Close
        </Button>
        <Button
          className="w-1/4 bg-yellow text-lg"
          onClick={() => router.push("/quiz/practice/1")}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
