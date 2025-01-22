import React from "react";

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
  const handleClick = (num: number) => {
    setCurrentPage(num);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <Button
          className="m-2"
          variant={i + 1 === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => handleClick(i + 1)}
          key={i}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
};

export default ButtonList;
