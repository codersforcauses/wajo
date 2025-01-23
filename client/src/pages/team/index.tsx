import Link from "next/link";
import React, { useEffect, useState } from "react";

import SidebarLayout from "@/components/sidebar-layout";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { TeamDatagrid } from "@/components/ui/Team/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";

const Index = () => {
  // Fetches the list of teams using the custom hook.
  const {
    data: teams,
    isLoading: isTeamLoading,
    isError: isTeamError,
    error: teamError,
  } = useFetchData<Team[]>({
    queryKey: ["team.list"],
    endpoint: "/team/list",
  });

  // Tracks the current page number for pagination.
  const [page, setPage] = useState<number>(1);

  // Stores the filtered list of teams based on search input.
  const [filteredData, setFilteredData] = useState<Team[]>([]);

  // Updates the filtered data when teams are loaded.
  useEffect(() => {
    if (teams) {
      setFilteredData(teams);
    }
  }, [teams]);

  // Filters teams based on the search input.
  const handleFilterChange = (value: string) => {
    if (!teams) return;

    if (value.trim() === "") {
      setFilteredData(teams);
    } else {
      const filtered = teams.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredData(filtered);
    }

    // Resets to the first page after a search.
    setPage(1);
  };

  // Displays a loading state while data is being fetched.
  if (isTeamLoading) {
    return <div>Loading...</div>;
  }

  // Displays an error message if the API request fails.
  if (isTeamError) {
    return <div>Error: {teamError?.message}</div>;
  }

  // Renders the main content, including the search bar and data grid.
  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        {/* Search bar to filter teams */}
        <SearchInput
          label=""
          value={""}
          placeholder="Search by name..."
          onSearch={handleFilterChange}
        />
        {/* Button to navigate to the create team page */}
        <Button asChild className="mr-6">
          <Link href={"team/create"}>Create a Team</Link>
        </Button>
      </div>

      {/* Data grid to display the list of teams */}
      <TeamDatagrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></TeamDatagrid>
    </div>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <SidebarLayout role="admin">{page}</SidebarLayout>;
};

export default Index;
