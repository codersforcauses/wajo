import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Datagrid } from "@/components/ui/Question/data-grid";
import { SearchInput } from "@/components/ui/search";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Question } from "@/types/question";

export default function Index() {
  // Fetches the list of questions using the custom hook.
  const {
    data: questions,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: QuestionError,
  } = useFetchData<Question[]>({
    queryKey: ["question.list"],
    //endpoint: "/question/list",
    endpoint: "http://localhost:8000/api/question/questions/",
  });

  // Tracks the current page number for pagination.
  const [page, setPage] = useState<number>(1);

  // Stores the filtered list of questions based on search input.
  const [filteredData, setFilteredData] = useState<Question[]>([]);

  // Updates the filtered data when questions are loaded.
  useEffect(() => {
    if (questions) {
      setFilteredData(questions);
    }
  }, [questions]);

  // Filters questions based on the search input.
  const handleFilterChange = (value: string) => {
    if (!questions) return;

    if (value.trim() === "") {
      setFilteredData(questions);
    } else {
      const filtered = questions.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredData(filtered);
    }

    // Resets to the first page after a search.
    setPage(1);
  };

  // Displays a loading state while data is being fetched.
  if (isQuestionLoading) {
    return <div>Loading...</div>;
  }

  // Displays an error message if the API request fails.
  if (isQuestionError) {
    return <div>Error: {QuestionError?.message}</div>;
  }

  // Renders the main content, including the search bar and data grid.
  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        {/* Search bar to filter questions */}
        <SearchInput
          label=""
          value={""}
          placeholder="Search by name..."
          onSearch={handleFilterChange}
        />
        {/* Button to navigate to the create quiz page */}
        <Button asChild className="mr-6">
          <Link href={"question/create"}>Create a Quiz</Link>
        </Button>
      </div>

      {/* Data grid to display the list of questions */}
      <Datagrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></Datagrid>
    </div>
  );
}
