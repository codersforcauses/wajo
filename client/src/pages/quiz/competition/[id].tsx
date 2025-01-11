import { useState } from "react";

import GenericQuiz from "@/components/ui/generic-quiz";
import Pagination from "@/components/ui/pagination";
import { useFetchData } from "@/hooks/use-fetch-data";

export default function CompetitionQuizPage() {
  // Fetches the quiz data using the custom hook.
  const {
    data: quizData,
    isLoading: isQuizDataLoading,
    isError: isQuizDataError,
    error: QuizDataError,
  } = useFetchData<Quiz>({
    queryKey: ["quiz.list"],
    endpoint: "/quiz/list",
  });

  if (isQuizDataLoading) {
    return <div>Loading...</div>;
  }

  // Displays an error message if the API request fails.
  if (isQuizDataError) {
    return <div>Error: {QuizDataError?.message}</div>;
  }

  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * Handles page change logic.
   * @param {number} page - The new page number.
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (quizData?.questions?.length ?? 0)) {
      setCurrentPage(page);
    }
  };

  // Tracks the current page number for pagination.
  const [page, setPage] = useState<number>(1);

  return (
    <div className="flex flex-col items-center border-2 border-orange-600">
      <h1 className="my-4 text-center">
        {quizData?.name ?? "Math Competition"}
      </h1>
      <GenericQuiz />
      <Pagination
        totalPages={quizData?.questions?.length ?? 0}
        currentPage={page}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}
