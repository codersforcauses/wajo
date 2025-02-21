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
  const buttonsPerPage = 10;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(
    Math.min(buttonsPerPage, totalQuestions),
  );

  useEffect(() => {
    if (totalQuestions <= buttonsPerPage) {
      // If totalQuestions is less than buttonsPerPage, just show all buttons
      setStartIndex(0);
      setEndIndex(totalQuestions);
      return;
    }

    const halfButtons = Math.floor(buttonsPerPage / 2);

    if (currentPage <= halfButtons) {
      // When at the start of the list
      setStartIndex(0);
      setEndIndex(buttonsPerPage);
    } else if (currentPage >= totalQuestions - halfButtons) {
      // When at the end of the list
      setStartIndex(totalQuestions - buttonsPerPage);
      setEndIndex(totalQuestions);
    } else {
      // Normal pagination case
      setStartIndex(currentPage - halfButtons);
      setEndIndex(currentPage + halfButtons);
    }
  }, [currentPage, totalQuestions]);

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: endIndex - startIndex }, (_, i) => {
        const pageNumber = startIndex + i + 1;
        return (
          <Button
            key={pageNumber}
            className="m-2"
            variant={pageNumber === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}
    </div>
  );
};

export default ButtonList;
