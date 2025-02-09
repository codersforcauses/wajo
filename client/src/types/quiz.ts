import { z } from "zod";

import { Question } from "@/types/question";

export interface AdminQuiz {
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

export interface AdminQuizSlot {
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

const createQuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1, "Question name is required"),
});

const createQuestionBlockSchema = z.object({
  id: z.number().int().nonnegative(),
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});

/**
 * Zod schema for validating generic test creation input.
 *
 * Validates name, general instructions, and at least one question block.
 *
 * @constant
 */
export const genericCreateTestSchema = z.object({
  name: z.string().min(1, "Required"),
  general_instructions: z.string().min(1, "Required"),
  blocks: z
    .array(createQuestionBlockSchema)
    .min(1, "At least one question block is required"), // An array of question blocks
});

/**
 * Zod schema for validating competition creation input.
 *
 * Extends the generic test schema and ensures that the start time is earlier than the end time.
 *
 * @constant
 */
export const createCompetitionSchema = genericCreateTestSchema
  .extend({
    start_time: z.date(),
    end_time: z.date(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time must be earlier than end time.",
    path: ["start_time"], // optional: Specify which field the error applies to
  });

/**
 * Zod schema for validating practice creation input.
 *
 * Extends the generic test schema with additional validations for `hours` and `minutes`.
 *
 * @constant
 */
export const createPracticeSchema = genericCreateTestSchema.extend({
  hours: z
    .number()
    .min(0, "Number must be at least 0")
    .max(24, "Number must be at most 24"),
  minutes: z
    .number()
    .min(0, "Number must be at least 0")
    .max(60, "Number must be at most 60"),
});
