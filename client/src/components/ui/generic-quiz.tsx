import React, { use, useEffect } from "react";
import { set } from "zod";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";

interface GenericQuizProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
}

export default function GenericQuiz({
  currentPage,
  setCurrentPage,
  totalQuestions,
}: GenericQuizProps) {
  let headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;
  // these values will be fetched from the database
  // let questionNumber = 1;
  let marks = 2;
  let question =
    "After 15 women leave a party, there are 3 times as many men as women. Later 40 men leave, so that then 7 times as many women as men remain. How many women were there at the start of the party?";
  let mathJax = "";

  const [questionNumber, setQuestionNumber] = React.useState(currentPage);

  useEffect(() => {
    setQuestionNumber(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function onSave() {
    // save the answer
    console.log("Answer saved");
  }

  const handleNext = () => {
    if (currentPage < totalQuestions) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex w-full items-center justify-center border-2 border-green-600">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Question {questionNumber}</h2>
          {marks === 1 ? (
            <h2 className={headingStyle}>[{marks} Mark]</h2>
          ) : (
            <h2 className={headingStyle}>[{marks} Marks]</h2>
          )}
        </div>
        <p>{question}</p>
        <p className="mb-6 mt-4">{mathJax}</p>
        <br />
        <h3 className="mt-8 text-lg text-slate-800 sm:text-xl md:text-2xl">
          Your Answer
        </h3>
        <p className="text-slate-400">
          Must be an integer from 1-999, use "," to seperate multiple answers
        </p>
        <input
          type="text"
          placeholder="Please input your answer"
          className="mt-4 h-10 w-full min-w-64 rounded-sm border border-slate-500 px-2"
        />
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
