import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import ButtonList from "@/components/ui/buttonList";
import GenericQuiz from "@/components/ui/generic-quiz";
import SubmissionPopup from "@/components/ui/submissionPopup";

export default function PracticeQuizPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true); // Show the popup
  };

  const closePopup = () => {
    setIsSubmitted(false); // Hide the popup
  };

  const tryAgain = () => {
    console.log("Try again");
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const questionNumbers = 16;
  // this value will be fetched from the database
  let practiceName = "Practice Quiz";
  return (
    <div className="border-2 border-orange-600">
      <h1 className="my-4 text-center">{practiceName}</h1>
      <div className="flex items-center" space-x-2>
        <p>Question Navigation: </p>
        <ButtonList
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalQuestions={questionNumbers}
        />
        <Button variant={"secondary"} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <GenericQuiz
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalQuestions={questionNumbers}
      />
      <SubmissionPopup
        popUpStyle="showScore"
        isOpen={isSubmitted}
        onClose={closePopup}
        onTry={tryAgain}
      />
    </div>
  );
}
