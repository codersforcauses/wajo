import { useState } from "react";

import { Search, SearchInput, SearchSelect } from "@/components/ui/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { Leaderboard } from "@/types/leaderboard";

/**
 * LeaderboardList component displays a table of leaderboards with filtering capabilities.
 * It fetches leaderboard data from an API and allows users to filter the list based on
 * leaderboard name and status. The component also handles loading and error states for
 * data fetching.
 */
export function LeaderboardList() {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const {
    data: leaderboards,
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
    error: leaderboardError,
  } = useFetchData<Leaderboard[]>({
    queryKey: ["leaderboards.list"],
    endpoint: "leaderboard/list",
  });

  if (isLeaderboardLoading) return <div>Loading...</div>;

  if (isLeaderboardError) {
    console.error("Error fetching leaderboards:", leaderboardError);
    return <div>Error fetching leaderboards</div>;
  }

  const statusOptions = ["All"].concat(
    Array.from(
      new Set(leaderboards?.map((leaderboard: any) => leaderboard.status)),
    ),
  );

  const filteredLeaderboards = leaderboards?.filter((leaderboard: any) => {
    const matchesStatus =
      filters.status === "All" || leaderboard.status === filters.status;

    const matchesSearch =
      !filters.search || leaderboard.name.includes(filters.search);

    return matchesStatus && matchesSearch;
  });

  /**
   * Handles filter changes for search and status.
   *
   * @param {string} name The name of the filter (either 'search' or 'status' or both).
   * @param {string} value The value to set for the filter.
   */
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full px-4">
      <Search title="Leaderboard">
        <SearchInput
          label="Name"
          value={filters.search}
          placeholder="Enter name..."
          onSearch={(value) => handleFilterChange("search", value)}
        />
        <SearchSelect
          label="Status"
          options={statusOptions}
          placeholder="Select a Status"
          onChange={(value) => handleFilterChange("status", value)}
        />
      </Search>
      <Table
        title="Leaderboard"
        className="border-collapse border border-gray-300 text-left shadow-md"
      >
        <TableHeader className="bg-gray-100 text-xs uppercase text-gray-700">
          <TableRow>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              Name
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              School
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              SchoolEmail
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              UserName
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              Password
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              Individual Score
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              TeamName
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              TeamScore
            </TableHead>
            <TableHead className="border-b border-r border-[#7D916F] text-black">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-gray-200 text-black">
          {filteredLeaderboards === undefined ||
          filteredLeaderboards.length < 1 ? (
            <TableRow>
              <TableCell colSpan={10} className="py-4 text-center">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            filteredLeaderboards.map((leaderboard: any) => (
              <TableRow key={leaderboard.user_name}>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.name}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.school}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.school_email}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.user_name}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.password}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.individual_score}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.team_name}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.team_score}
                </TableCell>
                <TableCell className="border-r border-t border-r-[#7D916F] border-t-[#DEE4DB]">
                  {leaderboard.status}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
