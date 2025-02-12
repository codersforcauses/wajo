import { z } from "zod";

/**
 * Defines the possible user roles.
 *
 * @example
 * const role: Role = "student";
 */
export const RoleEnum = z.enum(["admin", "teacher", "student"], {
  errorMap: () => ({ message: "Invalid User Role" }),
});

/**
 * Type representing a user role. Can be one of the following:
 * - "admin"
 * - "teacher"
 * - "student"
 *
 * @type {Role}
 */
export type Role = z.infer<typeof RoleEnum>;

export const SchoolTypeEnum = z.enum(["Public", "Independent", "Catholic"], {
  errorMap: () => ({ message: "Invalid School Type" }),
});
export type SchoolType = z.infer<typeof SchoolTypeEnum>;

/**
 * Represents a user object.
 *
 * @interface User
 * @property {number} id - The unique identifier of the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {Role} role - The role of the user (admin, teacher, or student).
 * @property {string} school - The school name attached to the user.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  school: School;
}

export interface Student {
  id: number;
  name: string;
  year_level: number;
}

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
  type: SchoolType;
  is_country: boolean;
  created_at: Date; // ask: need from server
  abbreviation: string;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  school: School;
  email: string;
  phone: string;
  created_at: Date;
}

/**
 * Zod schema for validating login input.
 *
 * @example
 * // Example usage:
 * const validData = loginSchema.parse({
 *   username: "admin123",
 *   password: "admin123#",
 * });
 *
 * @const {z.ZodSchema} loginSchema
 *
 * @property {z.ZodString} username - Required, must be at least 1 character.
 * @property {z.ZodString} password - Required, must be at least 1 character.
 */
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Zod schema for validating user creation input.
 *
 * Extends the login schema to include additional user-related fields.
 *
 * @example
 * const validUser = createUserSchema.parse({
 *   username: "admin123",
 *   password: "admin123#",
 *   userRole: "student",
 *   school_id: 1,
 *   email: "user@example.com",
 * });
 */
export const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
  year_level: z.enum(["7", "8", "9"]),
  school_id: z.number().int().positive(),
  attendent_year: z.number().int().min(2024).max(2050),
  extenstion_time: z.number().int().min(0).optional(),
});
/**
 * A Zod schema for validating the creation of a school.
 *
 * @example
 * const schoolData = { name: "University of Example" };
 * const parsedData = createSchoolSchema.parse(schoolData);
 */
export const createSchoolSchema = z.object({
  name: z.string().min(1, "Required"),
  type: SchoolTypeEnum,
  is_country: z.boolean(),
  abbreviation: z.string().min(1, "Required"),
});

export const createRandomPwd = () => {
  const passhelp = require("passhelp");
  // 8 character alphanumeric for those silly banks. ensure that
  // it has 1 digit, 1 upper-case and 1 lower-case character
  return passhelp.character(8, passhelp.alphabets.alphanumeric, true); // "A2nJEH4o"
};
