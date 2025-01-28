import { z } from "zod";

import { School, Student } from "@/types/user";

export interface TeamMember {
  id: number;
  student: Student;
  time_added: Date;
  team: number;
}

/**
 * Represents a team with its id, name, associated school, description, and creation date.
 *
 * @interface Team
 * @property {number} id - The unique identifier for the team.
 * @property {string} name - The name of the team.
 * @property {string} school - The name of the school associated with the team.
 * @property {string} description - A description of the team.
 * @property {Date} time_created - The timestamp of when the team was created.
 */
export interface Team {
  id: number;
  members: TeamMember[];
  school: School;
  name: string;
  description: string;
  time_created: Date;
  students: Student[];
}

/**
 * A Zod schema for validating the creation of a team.
 *
 * @example
 * // Example usage of createTeamSchema to validate team data
 * const teamData = { name: "Team A", school_id: 1, description: "A great team" };
 * const parsedData = createTeamSchema.parse(teamData);
 */
export const createTeamSchema = z.object({
  name: z.string().min(1, "Required"),
  school_id: z.number({ message: "Required" }),
  description: z.string().min(1, "Required"),
});
