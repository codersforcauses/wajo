import { z } from "zod";

import { Category, Question } from "@/types/question";

export interface AdminQuiz {
  id: number;
  name: string;
  intro: string;
  total_marks: number;
  is_comp: boolean;
  visible: boolean;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: number;
}

export interface AdminQuizSlotRequest {
  question_id: number;
  slot_index: number;
  block: number;
  quiz_id: number;
}

export interface AdminQuizSlot {
  id: number;
  question: Question;
  slot_index: number;
  block: number;
  quiz: number;
}

export interface Quiz {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  is_comp: boolean;
  visible: boolean;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: number;
}

export interface QuizSlot {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  is_comp: boolean;
  visible: boolean;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: number;
}

export enum QuizStatus {
  NormalPractice = 0,
  Upcoming = 1,
  Ongoing = 2,
  Finished = 3,
}

export interface Competition {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: QuizStatus; // ask: to be discuss
}

export interface CompetitionSlot {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
}

export interface QuestionAttempt {
  id: number;
  answer_student: number;
  is_correct: boolean;
  student: number;
  question: number;
  quiz_attempt: number;
}

export enum QuizState {
  UNATTEMPTED = 1,
  IN_PROGRESS = 2,
  SUBMITTED = 3,
  COMPLETED = 4,
}

export interface QuizAttempt {
  id: number;
  current_page: number;
  state: QuizState;
  time_start: Date;
  time_finish: Date;
  time_modified: Date;
  total_marks: number;
  quiz: number;
  student: number;
  team: number;
}

export interface QuizSlot {
  id: number;
  question: Question;
  slot_index: number;
  block: number;
  quiz: number;
}

/**
 * Zod schema for validating generic test creation input.
 *
 * Validates name, general instructions.
 *
 * @constant
 */
export const genericCreateTestSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(255, "Name cannot exceed 255 characters"),
  intro: z.string().min(1, "Required"),
  open_time_date: z.date(),
  total_marks: z.number().int().nonnegative().default(0),
  time_limit: z.number().int().nonnegative().default(120),
  time_window: z.number().int().nonnegative().default(10),
});

// export const createCompetitionSchema = genericCreateTestSchema
//   .extend({
//     start_time: z.date(),
//     end_time: z.date(),
//   })
//   .refine((data) => data.start_time < data.end_time, {
//     message: "Start time must be earlier than end time.",
//     path: ["start_time"], // optional: Specify which field the error applies to
//   });

// export const createPracticeSchema = genericCreateTestSchema.extend({
//   hours: z
//     .number()
//     .min(0, "Number must be at least 0")
//     .max(24, "Number must be at most 24"),
//   minutes: z
//     .number()
//     .min(0, "Number must be at least 0")
//     .max(60, "Number must be at most 60"),
// });

const createQuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  diff_level: z.number().int().nonnegative(),
});

const createQuestionBlockSchema = z.object({
  id: z.number().int().nonnegative(),
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});

export const createSlotsSchema = z.object({
  blocks: z
    .array(createQuestionBlockSchema)
    .min(1, "At least one question block is required"),
});

type SlotsProps = {
  id: number;
  questions: {
    id: number;
    name: string;
    diff_level: number;
  }[];
};

export function mapSlotsToBlocks(slots: AdminQuizSlot[]): SlotsProps[] {
  if (slots.length === 0) {
    return [{ id: 0, questions: [] }]; // Default block with no questions
  }

  const groupedBlocks = slots.reduce<Record<number, SlotsProps>>(
    (acc, slot) => {
      if (!acc[slot.block]) {
        acc[slot.block] = { id: slot.block, questions: [] };
      }
      acc[slot.block].questions.push({
        id: slot.question.id,
        name: slot.question.name,
        diff_level: slot.question.diff_level,
      });
      return acc;
    },
    {},
  );

  return Object.values(groupedBlocks);
}

export function mapBlocksToSlots(blocks: SlotsProps[], quizId: number) {
  let slotIndex = 1; // global slot index counter
  return blocks.flatMap((block, block_idx) =>
    block.questions.map((question) => ({
      question_id: question.id,
      slot_index: slotIndex++,
      quiz_id: quizId,
      block: block_idx + 1,
    })),
  );
}
