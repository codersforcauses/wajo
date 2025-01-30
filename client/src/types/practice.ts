import { z } from "zod";

/**
 * Enum representing the status of a question.
 *
 * @enum
 */
export const QuestionStatusEnum = z.enum(["Published", "Unpublished"], {
  errorMap: () => ({ message: "Invalid Status" }),
});

/** Type alias for the QuestionStatusEnum. */
export type QuestionStatus = z.infer<typeof QuestionStatusEnum>;

/**
 * Zod schema for validating a question creation input.
 *
 * Ensures that each question has a non-negative integer ID and a non-empty name.
 *
 * @constant
 */
const createQuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1, "Question name is required"),
});

/**
 * Zod schema for validating a question block.
 *
 * Ensures that each question block has a non-negative integer ID and at least one question.
 *
 * @constant
 */
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
