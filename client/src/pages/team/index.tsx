import Link from "next/link";
import React, { useEffect, useState } from "react";

// import SidebarLayout from "@/components/sidebar-layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { TeamDatagrid } from "@/components/ui/Team/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Team } from "@/types/team";

export default function TeamsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("name"); // Default sorting field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [ordering, setOrdering] = useState<string>("name");

  const [search, setSearch] = useState(""); // Only updates when user submits search

  // Fetch data when page or sorting changes
  const { data, isLoading, error } = useFetchData<{
    results: Team[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["teams", currentPage, sortField, sortOrder, search], // Include search in queryKey
    endpoint: "/team/teams/",
    params: {
      page: currentPage,
      ordering,
      ...(search ? { search } : {}), // Only include search if not empty
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading teams.</p>;

  const pageSize = 5; // Adjust this if your backend uses a different page size
  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  // Handle sorting changes
  const handleSort = (field: keyof Team) => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortField(field);
    setOrdering(sortOrder === "asc" ? field : `-${field}`);
  };

  const handleSearchSubmit = (value: string) => {
    console.log("Search input changed to: ", value);
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (data?.results.length === 0) {
    return (
      <div className="m-4 space-y-4">
        <div className="flex justify-between">
          {/* Search bar to filter teams */}
          <SearchInput
            label=""
            value={search}
            placeholder="Search by name..."
            onSearch={handleSearchSubmit}
          />
          {/* Button to navigate to the create team page */}
          <Button asChild className="mr-6">
            <Link href={"team/create"}>Create a Team</Link>
          </Button>
        </div>
        <p>No teams found.</p>
      </div>
    );
  }
  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={search}
          placeholder="Search by name..."
          onSearch={handleSearchSubmit}
        />

        <Button asChild className="mr-6">
          <Link href={"team/create"}>Create a Team</Link>
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Teams</h1>
      <TeamDatagrid
        datacontext={data?.results ?? []}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
