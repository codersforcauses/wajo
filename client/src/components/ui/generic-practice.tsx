import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AdminQuizSlot } from "@/types/quiz";

import AutoSavingAnswer from "./Quiz/auto-saving";

interface GenericQuizProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
  questions: AdminQuizSlot[];
}

export default function GenericPractice({
  currentPage,
  setCurrentPage,
  totalQuestions,
  questions,
}: GenericQuizProps) {
  const headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;
  // these values will be fetched from the database
  // let questionNumber = 1;
  // let marks = 2;
  // let question =
  //   "After 15 women leave a party, there are 3 times as many men as women. Later 40 men leave, so that then 7 times as many women as men remain. How many women were there at the start of the party?";
  // let mathJax = "";

  // let questions = [
  //   {
  //     questionNumber: 1,
  //     question:
  //       "The regular hexagon ABCDEF shown, has area 24.What is the area of △ABD?",
  //     image: "hexagon.png",
  //     marks: 1,
  //   },
  //   {
  //     questionNumber: 2,
  //     question:
  //       "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //     image: "",
  //     marks: 1,
  //   },
  //   {
  //     questionNumber: 3,
  //     question:
  //       "After 15 women leave a party, there are 3 times as many men as women. Later 40 men leave, so that then 7 times as many women as men remain. How many women were there at the start of the party?",
  //     image: "",
  //     marks: 1,
  //   },
  // ];

  const [questionNumber, setQuestionNumber] = useState(currentPage);
  const [currentQuestion, setCurrentQuestion] = useState<AdminQuizSlot>(
    questions[currentPage - 1],
  );

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

  function onSave() {
    // save the answer
    console.log("Answer saved", answer);
  }

  const handleNext = () => {
    if (currentPage < totalQuestions) {
      setCurrentPage(currentPage + 1);
      setCurrentQuestion(questions[currentPage - 1]);
    }
  };

  const [answer, setAnswer] = useState(
    () => localStorage.getItem("answer") || "",
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("answer", answer);
      setSaved(true);
    }, 2000); // Auto-save after 2 seconds
    return () => {
      clearTimeout(timer);
      setSaved(false);
    }; // Cleanup previous timer
  }, [answer]); // Runs when `answers` changes

  return (
    <div className="flex w-full items-center justify-center">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Question {questionNumber}</h2>
          <h2 className={headingStyle}>
            [{currentQuestion.question.mark}{" "}
            {currentQuestion.question.mark === 1 ? "Mark" : "Marks"}]
          </h2>
        </div>
        <p>{currentQuestion.question.question_text}</p>
        {/* <p className="mb-6 mt-4">{currentQuestion.mathJax}</p> */}
        <br />
        <h3 className="mt-8 text-lg text-slate-800 sm:text-xl md:text-2xl">
          Your Answer
        </h3>
        <p className="text-slate-400">
          Must be an integer from 1-999, use "," to seperate multiple answers
        </p>
        <div>
          <AutoSavingAnswer answer={answer} setAnswer={setAnswer} />{" "}
          {saved == true && <p className="text-gray-500">Saved!</p>}
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
