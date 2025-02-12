import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WaitingLoader } from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { SelectSchool } from "@/components/ui/Users/select-school";
import { useFetchData, useFetchDataTable } from "@/hooks/use-fetch-data";
import { usePostMutation } from "@/hooks/use-post-data";
import { usePutMutation } from "@/hooks/use-put-data";
import {
  createMembersSchema,
  createTeamSchema,
  Team,
  TeamMember,
} from "@/types/team";
import { Student } from "@/types/user";

type UpdateTeam = z.infer<typeof createTeamSchema>;
type UpdateTeamMembers = z.infer<typeof createMembersSchema>;

export default function Edit() {
  const router = useRouter();
  const teamId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Team>({
    queryKey: [`team.teams.${teamId}`],
    endpoint: `/team/teams/${teamId}/`,
    enabled: !isNaN(teamId),
  });

  const {
    data: dataMember,
    isLoading: isMemberLoading,
    isError: isMemberError,
    error: errorMember,
  } = useFetchData<TeamMember[]>({
    queryKey: [`team.teams.${teamId}.members`],
    endpoint: `/team/teams/${teamId}/members/`,
    enabled: !isNaN(teamId),
  });

  if (isLoading || !data || isMemberLoading || !dataMember)
    return <WaitingLoader />;
  if (isError) return <div>Error Team: {error?.message}</div>;
  if (isMemberError) return <div>Error Member: {errorMember?.message}</div>;

  return (
    <div>
      <EditTeamForm team={data} />
      <EditMembersForm team_members={dataMember} />
    </div>
  );
}

function EditTeamForm({ team }: { team: Team }) {
  const router = useRouter();

  const mutationKey = ["team_update", `${team.id}`];
  const { mutate: updateTeam, isPending } = usePutMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["team.teams"]],
    endpoint: `/team/teams/${team.id}/`,
    onSuccess: () => {
      router.reload();
      toast.success("Team has been updated.");
    },
  });

  const updateForm = useForm<UpdateTeam>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: team.name,
      school_id: team.school.id,
      description: team.description,
    },
  });

  const onSubmit = (data: UpdateTeam) => {
    updateTeam({
      name: data.name,
      school_id: data.school_id,
      description: data.description,
    });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...updateForm}>
      <form className="px-4" onSubmit={updateForm.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">Update Team</h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          {/* Name */}
          <FormField
            control={updateForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name {requiredStar}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input team name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* School */}
          <FormField
            control={updateForm.control}
            name={"school_id"}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>School {requiredStar}</FormLabel>
                <FormControl>
                  <SelectSchool
                    selectedId={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={updateForm.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>Description {requiredStar}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit">
              {isPending ? (
                <LoaderCircleIcon className="size-4 animate-spin text-primary" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function EditMembersForm({ team_members }: { team_members: TeamMember[] }) {
  const router = useRouter();
  const teamId = parseInt(router.query.id as string);

  const { mutate: createMembers, isPending } = usePostMutation<TeamMember>({
    mutationKey: ["team.teams.members.create"],
    endpoint: `/team/teams/${teamId}/members/`,
    onSuccess: () => {
      toast.success("Members updated successfully!");
      router.reload();
    },
  });

  const form = useForm<UpdateTeamMembers>({
    resolver: zodResolver(createMembersSchema),
    defaultValues: {
      members: team_members.map((mem) => ({
        student_id: mem.id,
        team: teamId,
      })),
    },
  });

  const onSubmit = (data: UpdateTeamMembers) => {
    createMembers([...data.members]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto flex max-w-3xl items-center gap-4 pt-6 font-bold text-gray-400">
          <hr className="flex-1 border-2 border-gray-200" />
          Update Team Members Below
          <hr className="flex-1 border-2 border-gray-200" />
        </div>
        {/* Members */}
        <div className="mx-auto my-4 max-w-3xl space-y-4 rounded-lg bg-gray-50 p-4 shadow-lg">
          <TeamMembersManager formControl={form.control} />
          <div className="flex justify-end gap-4">
            <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

type Props = {
  formControl: Control<any>;
};

function TeamMembersManager({ formControl }: Props) {
  const {
    fields: members,
    append,
    remove,
  } = useFieldArray({
    control: formControl,
    name: "members",
  });

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg">Team Members {requiredStar}</h3>
          <span className="flex items-center text-xs text-gray-400">
            You can add at most 4 members for a team.
          </span>
        </div>
      </div>
      {/* Members */}
      <FormField
        control={formControl}
        name="members"
        render={({ fieldState }) => (
          <FormItem>
            <FormControl>
              <div className="rounded-md bg-white p-4 shadow-md">
                {/* Member */}
                {members.map((member, idx) => (
                  <FormField
                    key={idx}
                    control={formControl}
                    name={`members.${idx}`}
                    render={({ fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <MemberBlock
                            key={member.id}
                            members={members}
                            addMember={append}
                            removeMember={remove}
                            memberIdx={idx}
                          />
                        </FormControl>
                        {fieldState.error?.message && <FormMessage />}
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormControl>
            {fieldState.error?.message && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

interface MemberProps {
  members: any;
  addMember: (value: Student) => void;
  removeMember: (index: number) => void;
  memberIdx: number;
}

const MemberBlock: React.FC<MemberProps> = ({
  members,
  addMember,
  removeMember,
  memberIdx,
}) => {
  const {
    data: studentList,
    isLoading,
    error,
    totalPages,
  } = useFetchDataTable<Student>({
    queryKey: ["users.students"],
    endpoint: "/users/students/",
    searchParams: {
      nrows: 999999, // to get all with some large number
      page: 1,
    },
  });
  console.log(studentList);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [isForceClose, setIsForceClose] = useState<boolean>(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = value
      ? studentList?.filter(
          (student) =>
            student.first_name.toLowerCase().includes(value.toLowerCase()) ||
            student.last_name.toLowerCase().includes(value.toLowerCase()) ||
            student.student_id.toLowerCase().includes(value.toLowerCase()),
        )
      : [];
    setSearchResults(filtered as Student[]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
        setIsForceClose(true);
      } else {
        setIsForceClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div className="mb-2 rounded-md border border-gray-300 bg-gray-100 p-4">
      <div className="flex items-center justify-between">
        {/* Search Results */}
        <div className="relative w-full" ref={searchContainerRef}>
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search Student(Id or Name)"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => handleSearch(searchTerm)}
            className="h-[40px] w-full rounded border border-gray-300 pl-10 text-gray-700"
          />
          {searchTerm && !isForceClose && (
            <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
              {isLoading || error || searchResults?.length < 1 ? (
                <div className="p-2 text-center text-gray-500">
                  {isLoading
                    ? "Loading..."
                    : error
                      ? "Failed to fetch students."
                      : "No results found or student does not belongs to the team school."}
                </div>
              ) : (
                <ul>
                  {searchResults.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between border-b p-2 last:border-0 hover:bg-gray-100"
                    >
                      <span>{student.last_name}</span>
                      <Button type="button" onClick={() => addMember(student)}>
                        Add
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Member Table */}
      <div className="space-y-4 p-0 pt-2">
        <div className="grid">
          <div className="overflow-hidden rounded-lg border border-black">
            <Table className="w-full border-collapse text-left shadow-md">
              <TableHeader className="bg-black text-lg font-semibold">
                <TableRow className="hover:bg-muted/0">
                  <TableHead className={commonTableHeadClasses}>Id</TableHead>
                  <TableHead className={commonTableHeadClasses}>Name</TableHead>
                  <TableHead className={commonTableHeadClasses}>
                    Difficulty
                  </TableHead>
                  <TableHead className={commonTableHeadClasses}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((field: Student) => (
                  <TableRow>
                    <TableCell className="w-0 py-2">
                      {field.student_id}
                    </TableCell>
                    <TableCell className="w-full py-2">
                      {field.first_name}
                    </TableCell>
                    <TableCell className="w-0 py-2">
                      {field.last_name}
                    </TableCell>
                    <TableCell className="w-0 py-2 text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeMember(memberIdx)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
