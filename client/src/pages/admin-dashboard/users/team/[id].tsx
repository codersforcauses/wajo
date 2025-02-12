import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { SelectSchool } from "@/components/ui/Users/select-school";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePutMutation } from "@/hooks/use-put-data";
import { createTeamSchema, Team } from "@/types/team";

type UpdateTeam = z.infer<typeof createTeamSchema>;

export default function Edit() {
  const router = useRouter();
  const teamId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<Team>({
    queryKey: [`team.teams.${teamId}`],
    endpoint: `/team/teams/${teamId}/`,
    enabled: !isNaN(teamId),
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else return <EditTeamForm team={data} />;
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
