import React, { useState } from "react";

import { Button } from "@/components/ui/button";

interface ButtonListProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
}

const ButtonList: React.FC<ButtonListProps> = ({
  currentPage,
  setCurrentPage,
  totalQuestions,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const buttonsPerPage = 10;

  const handleClick = (num: number) => {
    setCurrentPage(num);

    if (startIndex === 0) {
      if (num < 10) {
        setStartIndex(0);
        setEndIndex(10);
      } else if (num >= 10) {
        setStartIndex(6);
        setEndIndex(16);
      }
    } else if (num === 7) {
      setStartIndex(0);
      setEndIndex(10);
    }

    console.log(startIndex);
    console.log(endIndex);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: endIndex - startIndex }, (_, i) => (
          <Button
            className="m-2"
            variant={startIndex + i + 1 === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => handleClick(startIndex + i + 1)}
            key={startIndex + i}
          >
            {startIndex + i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ButtonList;
