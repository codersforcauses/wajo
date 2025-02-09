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
  school: string;
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
  type: string;
  is_country: boolean;
  created_at: Date; // need from server
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
 * @property {z.ZodString} password - Required, must be at least 8 characters, include letters, numbers, and symbols.
 */
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers")
    .regex(/[^A-Za-z0-9]/, "Password must contain symbols"),
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
export const createUserSchema = loginSchema.extend({
  userRole: RoleEnum,
  school_id: z.number({ message: "Required" }),
  email: z.string().email("Invalid email address").optional(),
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
});
