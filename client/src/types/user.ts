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
export type Role = z.infer<typeof RoleEnum>;

/**
 * Represents a user object.
 *
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

/**
 * Zod schema for validating login input.
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

export const createUserSchema = loginSchema.extend({
  userRole: RoleEnum,
  school_id: z.number({ message: "Required" }),
  email: z.string().email("Invalid email address").optional(),
});
