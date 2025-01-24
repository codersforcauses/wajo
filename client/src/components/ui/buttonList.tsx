import React, { useEffect, useState } from "react";

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

  const updateIndexes = () => {
    // if (currentPage > endIndex) {
    //   setStartIndex(currentPage - 1);
    //   setEndIndex(currentPage + 9);
    // } else if (currentPage < startIndex) {
    //   setStartIndex(currentPage - 1);
    //   setEndIndex(currentPage + 9);
    // }
    if (startIndex === 0) {
      if (currentPage < 10) {
        setStartIndex(0);
        setEndIndex(10);
      } else if (currentPage >= 10) {
        setStartIndex(6);
        setEndIndex(16);
      }
    } else if (currentPage === 7) {
      setStartIndex(0);
      setEndIndex(10);
    }
  };

  const handleClick = (num: number) => {
    setCurrentPage(num);
    updateIndexes();

    console.log(startIndex);
    console.log(endIndex);
  };

  useEffect(() => {
    updateIndexes();
  }, [currentPage]);

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
