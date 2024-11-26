import { useState } from "react";

import { Search, SearchDropdown, SearchInput } from "@/components/ui/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetchData from "@/hooks/use-fetch-data";

const LeaderboardList = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const {
    data: leaderboards,
    loading: leaderboardLoading,
    error: leaderboardError,
  } = useFetchData("/app/leaderboard/", true);

  if (leaderboardLoading) {
    return <div>Loading...</div>;
  }

  if (leaderboardError) {
    console.error("Error fetching leaderboards:", leaderboardError);
    return <div>Error fetching leaderboards</div>;
  }

  const statusOptions = ["All"].concat(
    Array.from(
      new Set(leaderboards.map((leaderboard: any) => leaderboard.status)),
    ),
  );

  const filteredLeaderboards = leaderboards.filter((leaderboard: any) => {
    const matchesStatus =
      filters.status === "All" || leaderboard.status === filters.status;

    const matchesSearch =
      !filters.search ||
      leaderboard.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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
        <SearchDropdown
          label="Status"
          options={statusOptions}
          onChange={(value) => handleFilterChange("status", value)}
        />
      </Search>
      <Table title="Leaderboard">
        <TableHeader>
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
        <TableBody className="text-black">
          {filteredLeaderboards?.length > 0 ? (
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
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="py-4 text-center">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardList;
