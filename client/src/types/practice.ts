import { z } from "zod";

import {
  genericCreateTestSchema,
  QuestionBlock,
  QuestionStatus,
} from "./competition";

/**
 * Interface representing a Practice session.
 *
 * @interface
 */
export interface Practice {
  id: number;
  name: string;
  general_instructions: string;
  hours: number;
  minutes: number;
  status: QuestionStatus;
  blocks: QuestionBlock[];
}

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
