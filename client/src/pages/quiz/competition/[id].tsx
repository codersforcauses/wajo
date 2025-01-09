import { useState } from "react";

import GenericQuiz from "@/components/ui/generic-quiz";
import Pagination from "@/components/ui/pagination";

export default function CompetitionQuizPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  let numQuestions = 16;
  let totalPages = 16;
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * Handles page change logic.
   * @param {number} page - The new page number.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // this value will be fetched from the database
  let competitionName = "Maths Competition";

  return (
    <div className="flex flex-col items-center border-2 border-orange-600">
      <h1 className="my-4 text-center">{competitionName}</h1>
      <GenericQuiz />
      <Pagination
        totalPages={numQuestions}
        currentPage={1}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}
