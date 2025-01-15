import { z } from "zod";

/**
 * Represents a school with its id, name, and creation date.
 *
 * @interface School
 * @property {number} id - The unique identifier for the school.
 * @property {string} name - The name of the school.
 * @property {Date} time_created - The timestamp of when the school was created.
 */
export interface School {
  id: number;
  name: string;
  time_created: Date;
}

/**
 * A Zod schema for validating the creation of a school.
 *
 * @example
 * const schoolData = { name: "University of Example" };
 * const parsedData = createSchoolSchema.parse(schoolData);
 */
export const createSchoolSchema = z.object({
  name: z.string().min(1, "Required"),
});
