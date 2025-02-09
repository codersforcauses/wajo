import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck } from "lucide-react";
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
import { QuestionBlockManager } from "@/components/ui/Test/question-block-manager";
import { Textarea } from "@/components/ui/textarea";
import {
  DateTimePicker,
  DateTimePickerFormat,
} from "@/components/ui/time-picker/date-time-picker";
import { useFetchData, useMarkCompetition } from "@/hooks/use-fetch-data";
import { usePostMutation } from "@/hooks/use-post-data";
import { usePatchMutation } from "@/hooks/use-put-data";
import {
  AdminQuiz,
  AdminQuizSlot,
  AdminQuizSlotRequest,
  createSlotsSchema,
  genericCreateTestSchema,
  mapBlocksToSlots,
  mapSlotsToBlocks,
} from "@/types/quiz";

type UpdateCompetition = z.infer<typeof genericCreateTestSchema>;
type UpdateCompetitionSlots = z.infer<typeof createSlotsSchema>;

export default function Create() {
  const router = useRouter();
  const adminQuizId = parseInt(router.query.id as string);

  const { data, isLoading, isError, error } = useFetchData<AdminQuiz>({
    queryKey: [`quiz.admin-quizzes.${adminQuizId}`],
    endpoint: `/quiz/admin-quizzes/${adminQuizId}/`,
    enabled: !isNaN(adminQuizId),
  });

  const {
    data: dataSlot,
    isLoading: isSlotLoading,
    isError: isSlotError,
    error: errorSlot,
  } = useFetchData<AdminQuizSlot[]>({
    queryKey: [`quiz.admin-quizzes.${adminQuizId}.slots`],
    endpoint: `/quiz/admin-quizzes/${adminQuizId}/slots/`,
    enabled: !isNaN(adminQuizId),
  });

  if (isLoading || !data || isSlotLoading || !dataSlot)
    return <WaitingLoader />;
  if (isError) return <div>Error Competition: {error?.message}</div>;
  if (isSlotError)
    return <div>Error Competition Slots: {errorSlot?.message}</div>;

  return (
    <div>
      <UpdateCompetitionForm adminQuiz={data} />
      <UpdateCompetitionQuestionBlocksForm adminQuizSlots={dataSlot} />
    </div>
  );
}

function UpdateCompetitionForm({ adminQuiz }: { adminQuiz: AdminQuiz }) {
  const form = useForm<UpdateCompetition>({
    resolver: zodResolver(genericCreateTestSchema),
    defaultValues: {
      name: adminQuiz.name,
      intro: adminQuiz.intro,
      open_time_date: DateTimePickerFormat(adminQuiz.open_time_date),
      time_limit: adminQuiz.time_limit,
      time_window: adminQuiz.time_window,
    },
  });

  const router = useRouter();
  const adminQuizId = parseInt(router.query.id as string);
  const mutationKey = ["quiz.admin-quizzes.update", `${adminQuizId}`];
  const { mutate: updateCompetition, isPending } = usePatchMutation({
    mutationKey: mutationKey,
    queryKeys: [mutationKey, ["quiz.admin-quizzes"]],
    endpoint: `/quiz/admin-quizzes/${adminQuizId}/`,
    onSuccess: () => {
      toast.success("Competition created successfully!");
      router.reload();
    },
  });

  const onSubmit = (data: UpdateCompetition) => {
    updateCompetition({
      name: data.name,
      intro: data.intro,
      total_marks: data.total_marks,
      open_time_date: data.open_time_date,
      time_limit: data.time_limit,
      time_window: data.time_window,
    });
  };

  const markCompetition = useMarkCompetition({
    onSuccess: () => {
      toast.success("Competition marked successfully!");
    },
  });
  const handleFetch = () => {
    markCompetition.mutate({ quiz_id: adminQuizId, timeout: 1000 });
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="my-4 text-center text-xl font-bold">
          Update Competition
        </h1>

        <div className="mx-auto max-w-3xl space-y-6 rounded-lg bg-gray-50 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="-mb-2 text-lg">Basic</h3>
            <Button
              type="button"
              onClick={handleFetch}
              variant={"link"}
              disabled={markCompetition.isPending}
              className="rounded-lg border-green-700 p-2 text-2xl font-black text-green-700 outline-double"
            >
              <CheckCheck className="me-1" size={30} />
              {markCompetition.isPending ? "Marking" : "Mark"}
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex-auto">
              {/* Test Name */}
              <FormField
                name="name"
                control={form.control}
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name {requiredStar}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Please input test name"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-none">
              {/* Open Time */}
              <FormField
                name="open_time_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col gap-1.5">
                    <FormLabel>Open Time {requiredStar}</FormLabel>
                    <FormControl>
                      <DateTimePicker field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Intro */}
          <FormField
            name="intro"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between gap-1.5 space-y-0">
                <FormLabel>Intro {requiredStar}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please input test general instructions"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <div className="flex-auto">
              {/* Time Limit */}
              <FormField
                name="time_limit"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Please input time limit"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-auto">
              {/* Time Window */}
              <FormField
                name="time_window"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-col gap-1.5">
                    <FormLabel>Time Window</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Please input time window"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        } // Convert to number
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function UpdateCompetitionQuestionBlocksForm({
  adminQuizSlots,
}: {
  adminQuizSlots: AdminQuizSlot[];
}) {
  const router = useRouter();
  const adminQuizId = parseInt(router.query.id as string);

  const { mutate: createSlots, isPending } =
    usePostMutation<AdminQuizSlotRequest>(
      ["quiz.admin-quizzes.competition.slots.create"],
      `/quiz/admin-quizzes/${adminQuizId}/slots/`,
      1000,
      {
        onSuccess: () => {
          toast.success("Competition question blocks created successfully!");
          router.reload();
        },
      },
    );

  const form = useForm<UpdateCompetitionSlots>({
    resolver: zodResolver(createSlotsSchema),
    defaultValues: {
      blocks: mapSlotsToBlocks(adminQuizSlots),
    },
  });

  const onSubmit = (data: UpdateCompetitionSlots) => {
    createSlots([...mapBlocksToSlots(data.blocks, adminQuizId)]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto flex max-w-3xl items-center gap-4 pt-6 font-bold text-gray-400">
          <hr className="flex-1 border-2 border-gray-200" />
          Update Competition Question Blocks Below
          <hr className="flex-1 border-2 border-gray-200" />
        </div>
        {/* Question Blocks */}
        <div className="mx-auto my-4 max-w-3xl space-y-4 rounded-lg bg-gray-50 p-4 shadow-lg">
          <QuestionBlockManager formControl={form.control} />
          <div className="flex justify-end gap-4">
            <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
