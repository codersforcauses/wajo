import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Datagrid } from "@/components/ui/Question/data-grid";
import { SearchInput } from "@/components/ui/search";

export default function Index() {
  const [data, setData] = useState<Question[]>([
    {
      name: "Question01_2024",
      category: "Geometry Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question02_2024",
      category: "Algebra Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question03_2024",
      category: "Arithmetic Questions",
      difficulty: "Easy",
    },
    {
      name: "Question04_2024",
      category: "Statistics Questions",
      difficulty: "Medium",
    },
    {
      name: "Question05_2024",
      category: "Calculus Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question06_2024",
      category: "Calculus Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question07_2024",
      category: "Calculus Questions",
      difficulty: "Easy",
    },
    {
      name: "Question08_2024",
      category: "Calculus Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question09_2024",
      category: "Calculus Questions",
      difficulty: "Difficult",
    },
    {
      name: "Question10_2024",
      category: "Calculus Questions",
      difficulty: "Easy",
    },
    {
      name: "Question11_2024",
      category: "Calculus Questions",
      difficulty: "Medium",
    },
    {
      name: "Question12_2024",
      category: "Calculus Questions",
      difficulty: "Difficult",
    },
  ]);
  const [page, setPage] = useState<number>(1);

  const [filteredData, setFilteredData] = useState<Question[]>(data);

  const handleFilterChange = (value: string) => {
    if (value.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredData(filtered);
    }
    setPage(1);
  };

  // const onSetPage = (pageNum: number) => {
  //   setPage(pageNum);
  // };

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search by name..."
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6">
          <Link href={"question/create"}>Create a Quiz</Link>
        </Button>
      </div>

      <Datagrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        ChangePage={page}
      ></Datagrid>
    </div>
  );
}
