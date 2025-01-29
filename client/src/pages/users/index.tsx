import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { WaitingLoader } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search";
import { DataGrid } from "@/components/ui/Users/data-grid";
import { useFetchData } from "@/hooks/use-fetch-data";
import type { Student, Teacher, User } from "@/types/user";

export default function UserList() {
  const {
    data: studentUsers,
    isLoading: isStudentUsersLoading,
    isError: isStudentUsersError,
    error: studentUsersError,
  } = useFetchData<Student[]>({
    queryKey: ["users.students.list"],
    endpoint: "/users/students/",
  });

  const {
    data: teacherUsers,
    isLoading: isTeacherUsersLoading,
    isError: isTeacherUsersError,
    error: teacherUsersError,
  } = useFetchData<Teacher[]>({
    queryKey: ["users.teachers.list"],
    endpoint: "/users/teachers/",
  });

  const {
    data: staffUsers,
    isLoading: isStaffUsersLoading,
    isError: isStaffUsersError,
    error: staffUsersError,
  } = useFetchData<User[]>({
    queryKey: ["users.staffs.list"],
    endpoint: "/users/staffs/",
  });

  const [page, setPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    if (studentUsers) {
      console.log(studentUsers);
      setFilteredData(studentUsers);
    }
  }, [studentUsers]);

  const handleFilterChange = (value: string) => {
    if (!studentUsers) return;

    const filtered =
      value.trim() === ""
        ? studentUsers
        : studentUsers.filter((item) => {
            const query = value.toLowerCase().trim();
            const isExactMatch = query.startsWith('"') && query.endsWith('"');
            const normalizedQuery = isExactMatch ? query.slice(1, -1) : query;

            return isExactMatch
              ? `${item.first_name.toLowerCase()}${item.last_name.toLowerCase()}` ===
                  normalizedQuery
              : `${item.first_name.toLowerCase()}${item.last_name.toLowerCase()}`.includes(
                  normalizedQuery,
                );
          });

    setFilteredData(filtered);
    setPage(1);
  };

  if (isStudentUsersLoading) return <WaitingLoader />;
  if (isStudentUsersError)
    return <div>Error: {studentUsersError?.message}</div>;

  return (
    <div className="m-4 space-y-4">
      <div className="flex justify-between">
        <SearchInput
          label=""
          value={""}
          placeholder="Search User"
          onSearch={handleFilterChange}
        />
        <Button asChild className="mr-6 h-auto">
          <Link href={"users/create/"}>Create a User</Link>
        </Button>
      </div>

      <DataGrid
        datacontext={filteredData}
        onDataChange={setFilteredData}
        changePage={page}
      ></DataGrid>
    </div>
  );
}
