import { z } from "zod";

/**
 * Type representing a user role. Can be one of the following:
 * - "admin"
 * - "teacher"
 * - "student"
 *
 * @type {Role}
 */
// export type Role = z.infer<typeof RoleEnum>;
export enum Role {
  ADMIN = "admin",
  STUDENT = "student",
  TEACHER = "teacher",
}

/**
 * Defines the possible user roles.
 *
 * @example
 * const role: Role = "student";
 */
export const RoleEnum = z.enum([Role.ADMIN, Role.TEACHER, Role.STUDENT], {
  errorMap: () => ({ message: "Invalid User Role" }),
});

/**
 * Defines the possible schools.
 *
 * @example
 * const school: School = "public";
 */
export const SchoolTypeEnum = z.enum(["Public", "Independent", "Catholic"], {
  errorMap: () => ({ message: "Invalid School Type" }),
});

/**
 * Type representing a school type. Can be one of the following:
 * - "public"
 * - "independent"
 * - "catholic"
 *
 * @type {SchoolType}
 */
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
  username?: string;
  first_name: string;
  last_name: string;
  password: string;
  role: Role;
  school?: School;
  student_id?: string;
  email?: string;
}

export interface Student extends User {
  year_level: number;
  quiz_attempts: number[];
  attendent_year: number;
  school: School;
  created_at: Date;
  extenstion_time: number;
}

/**
 * Represents a school with its id, name, and creation date.
 *
 * @interface School
 * @property {number} id - The unique identifier for the school.
 * @property {string} name - The name of the school.
 * @property {Date} time_created - The timestamp of when the school was created.
 */
export type School = {
  id: number;
  name: string;
  type: string;
  is_country: boolean;
  created_at?: Date; // need from server
  abbreviation: string;
};

export interface Teacher extends User {
  school: School;
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
  password: z.string().min(1, "Password is required"),
  year_level: z.enum(["7", "8", "9"]),
  //School ID now is not compuslory, need to modify later
  school_id: z.number().int().positive("Required"),
  attendent_year: z.number().int().min(2024).max(2050),
  extenstion_time: z.number().int().min(0).optional(),
});

export const createStudentSchema = createUserSchema.extend({
  school_id: z.number().int(),
  year_level: z.number().int().positive(),
  attendent_year: z.number().int().positive().optional(),
  extension_time: z.number().int().optional(),
});

export const createTeacherSchema = createUserSchema.extend({
  school_id: z.number().int(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
});

export const updateStudentSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  year_level: z
    .number({ invalid_type_error: "Year Level must be a number" })
    .min(0, "Year must be at least 0")
    .max(60, "Year at most 60"),

  school_id: z.number({ invalid_type_error: "Required" }),
  attendent_year: z
    .number({ invalid_type_error: "Required" })
    .refine((val) => val >= 1000 && val <= 9999, {
      message: "Year must be a 4-digit number",
    })
    .default(new Date().getFullYear()),
  extension_time: z.number({ invalid_type_error: "Required" }).default(0),
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
