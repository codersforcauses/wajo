import Image from "next/image";
import React, { useEffect, useState } from "react";
import { set } from "zod";

import { Button } from "@/components/ui/button";
import { Question } from "@/types/question";

import AutoSavingAnswer from "./auto-saving";

interface GenericQuizProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
  questions: Question[];
}

export default function GenericQuiz({
  currentPage,
  setCurrentPage,
  totalQuestions,
  questions,
}: GenericQuizProps) {
  const headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;

  const [questionNumber, setQuestionNumber] = useState(currentPage);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    questions[currentPage - 1],
  );

  // console.log(currentQuestion.image.url);

  useEffect(() => {
    setQuestionNumber(currentPage);
    setCurrentQuestion(questions[currentPage - 1]);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentQuestion(questions[currentPage - 1]);
    }
  };

  const handleNext = () => {
    if (currentPage < totalQuestions) {
      setCurrentPage(currentPage + 1);
      setCurrentQuestion(questions[currentPage - 1]);
    }
  };

  const [answers, setAnswers] = useState<string[]>(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers
      ? JSON.parse(savedAnswers)
      : Array(totalQuestions).fill("");
  });

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentPage - 1] = e.target.value;
    setAnswers(newAnswers);
  };

  function onSave() {
    // save the answer
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    console.log("Answers saved", answers);
  }

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    console.log("saved: ", saved);
    const timer = setTimeout(() => {
      localStorage.setItem("answer", answers[questionNumber - 1]);
      setSaved(true);
    }, 2000); // Auto-save after 2 seconds
    console.log("answers: ", answers);
    return () => {
      clearTimeout(timer);
      setSaved(false);
    }; // Cleanup previous timer
  }, [answers]); // Runs when `answers` changes

  return (
    <div className="flex w-full items-center justify-center">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Question {questionNumber}</h2>
          <h2 className={headingStyle}>
            [{currentQuestion.mark}{" "}
            {currentQuestion.mark === 1 ? "Mark" : "Marks"}]
          </h2>
        </div>
        {process.env.NEXT_PUBLIC_BACKEND_URL && (
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL.replace("/api", "")}${currentQuestion.image.url}`}
            alt="Question Image"
            width={200}
            height={100}
          />
        )}
        <p>{currentQuestion.question_text}</p>
        {/* <p className="mb-6 mt-4">{currentQuestion.mathJax}</p> */}
        <br />
        <h3 className="mt-8 text-lg text-slate-800 sm:text-xl md:text-2xl">
          Your Answer
        </h3>
        <p className="text-slate-400">
          Must be an integer from 1-999, use "," to seperate multiple answers
        </p>
        <div>
          {/* <AutoSavingAnswer answer={answer} setAnswer={setAnswer} />{" "} */}
          <input
            type="text"
            value={answers[currentPage - 1]}
            onChange={handleAnswerChange}
            placeholder="Enter your answer"
            className="mt-4 h-10 w-full min-w-64 rounded-sm border border-slate-500 px-2"
          />
          {saved == true && <p className="text-gray-500">✅ Saved!</p>}
        </div>
        <div className="mt-6 flex flex-col items-center justify-center">
          <br />
          <div className="flex space-x-2">
            <Button variant="outline" size="lg" onClick={handlePrevious}>
              Previous
            </Button>
            <Button size="lg" onClick={onSave}>
              Save
            </Button>
            <Button variant="outline" size="lg" onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
