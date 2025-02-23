import { useState } from "react";

import { Search, SearchInput, SearchSelect } from "@/components/ui/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentManagement = () => {
  // State for the search input and select options
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Sample options for select
  const statusOptions = ["Active", "Inactive", "Suspended"];
  const groupOptions = ["Group 1", "Group 2"];
  const filterOptions = ["Filter 1", "Filter 2"];
  const sortOptions = ["Name", "Date"];

  // Sample table data
  const students = [
    {
      name: "John Doe",
      username: "johndoe",
      school: "School A",
      team: "Team 1",
      individual_score: 75,
      team_score: 150,
      year_group: "Year 1",
    },
    {
      name: "Jane Smith",
      username: "janesmith",
      school: "School B",
      team: "Team 2",
      individual_score: 85,
      team_score: 160,
      year_group: "Year 2",
    },
    {
      name: "Alex Brown",
      username: "alexbrown",
      school: "School A",
      team: "Team 1",
      individual_score: 90,
      team_score: 170,
      year_group: "Year 3",
    },
  ];

  // Handle the input change for the search input field
  const handleInputChange = (value: string) => {
    console.log("Search input changed to: ", value);
    setUsername(value); // Update the state with the new value
    // You can trigger a search here if needed
  };

  // Handle selection change
  const handleGroupByChange = (value: string) => setGroupBy(value);
  const handleFilterByChange = (value: string) => setFilterBy(value);
  const handleSortByChange = (value: string) => setSortBy(value);

  // Filter and sort students based on selections (for now, it's just by username)
  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(username.toLowerCase()),
  );

  return (
    <>
      <h1>Student Management</h1>
      <div className="mb-6 flex gap-4">
        {/* Selects for Group By, Filter By, Sort By */}
        <div className="flex gap-x-4">
          <Select onValueChange={handleGroupByChange}>
            <SelectTrigger>Group By: </SelectTrigger>
            <SelectContent>
              {groupOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleFilterByChange}>
            <SelectTrigger>Filter By: </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleSortByChange}>
            <SelectTrigger>Sort By: </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input for Username */}
        <div>
          <Search>
            <SearchInput
              label="Name"
              value={username}
              onSearch={handleInputChange} // Pass the handler to be triggered on blur or Enter key press
            />
          </Search>
        </div>
      </div>

      {/* Table for displaying student data */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Individual Score</TableHead>
            <TableHead>Team Score</TableHead>
            <TableHead>Year Group</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student, index) => (
            <TableRow key={index}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.username}</TableCell>
              <TableCell>{student.school}</TableCell>
              <TableCell>{student.team}</TableCell>
              <TableCell>{student.individual_score}</TableCell>
              <TableCell>{student.team_score}</TableCell>
              <TableCell>{student.year_group}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default StudentManagement;
