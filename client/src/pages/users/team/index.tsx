import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { TeamDataGrid } from "@/components/ui/Users/team-data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { Team } from "@/types/team";

export default function TeamList() {
  const {
    data: teams,
    isLoading: isTeamLoading,
    isError: isTeamError,
    error: TeamError,
  } = useFetchData<Team[]>({
    queryKey: ["team.teams"],
    endpoint: "/team/teams/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<Team[]>([]);

  useEffect(() => {
    if (teams) {
      setFilteredData(teams);
    }
  }, [teams]);

  const handleFilterChange = (value: string) => {
    if (!teams) return;

    const filtered =
      value.trim() === ""
        ? teams
        : teams.filter((item) => {
            const query = value.toLowerCase().trim();
            const isExactMatch = query.startsWith('"') && query.endsWith('"');
            const normalizedQuery = isExactMatch ? query.slice(1, -1) : query;

            return isExactMatch
              ? item.name.toLowerCase() === normalizedQuery
              : item.name.toLowerCase().includes(normalizedQuery);
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isTeamLoading) return <WaitingLoader />;
  if (isTeamError) return <div>Error: {TeamError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search Team"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"/users/team/create"}>Create a Team</Link>
        </Button>
      </div>

      <TeamDataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></TeamDataGrid>
    </div>
  );
}
