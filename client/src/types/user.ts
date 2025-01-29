import { PassThrough } from "stream";
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
 * Defines the possible schools.
 *
 * @example
 * const school: School = "public";
 */
export const SchoolTypeEnum = z.enum(
  ["public", "independent", "catholic", ""],
  {
    errorMap: () => ({ message: "Invalid School Type" }),
  },
);

/**
 * Type representing a school type. Can be one of the following:
 * - "public"
 * - "independent"
 * - "catholic"
 *
 * @type {SchoolType}
 */
export type SchoolType = z.infer<typeof SchoolTypeEnum>;

export interface School {
  id: number;
  name: string;
  type: SchoolType;
  is_country: boolean;
}

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
  // username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: Role;
}

export interface Student extends User {
  year_level: number;
  attendent_year: number;
  // quiz_attempts: any[];
  school_id: number;
}

export interface Teacher extends User {
  phone: string;
  email: string;
  school_id: number;
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
