import { z } from "zod";

import { School, Student } from "@/types/user";

/**
 * Represents a Team object with its properties.
 *
 * @interface Team
 * @property {string} teamId - The ID of the team.
 * @property {string} name - The name of the team.
 * @property {string} studentName - The name of the student in the team.
 * @property {string} schoolName - The name of the school the team belongs to.
 * @property {string} competitionPeriod - The competition period for the team.
 *
 * @example
 * const exampleTeam: Team = {
 *   teamId: "Team01_2024",
 *   name: "Team Alpha",
 *   studentName: "John Doe",
 *   schoolName: "XYZ High School",
 *   competitionPeriod: "2024"
 * };
 */

export interface TeamMember {
  id: number;
  student: Student;
  studentName?: string;
  time_added: Date;
  team: number;
}

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
 * Represents the properties for the Datagrid component.
 *
 * @interface DatagridProps
 * @property {Team[]} datacontext - The list of teams to display in the data grid.
 * @property {(updatedData: Team[]) => void} onDataChange - Callback function triggered when the data is updated.
 * @property {number} changePage - The current page of the data grid.
 *
 * @example
 * const exampleDatagridProps: DatagridProps = {
 *   datacontext: [
 *     { teamId: "Team01_2024", name: "Team Alpha", studentName: "John Doe", schoolName: "XYZ High School", competitionPeriod: "2024" },
 *     { teamId: "Team02_2024", name: "Team Beta", studentName: "Jane Smith", schoolName: "ABC High School", competitionPeriod: "2024" }
 *   ],
 *   onDataChange: (updatedData) => console.log("Data updated:", updatedData),
 *   changePage: 1
 * };
 */
// export interface TeamDatagridProps {
//   datacontext: Team[];
//   onDataChange: (updatedData: Team[]) => void;
//   changePage: number;
// }
export interface TeamDatagridProps {
  datacontext: Team[];
  onSort: (field: keyof Team) => void;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Represents the properties for the Pagination component.
 *
 * @interface PaginationProps
 * @property {number} totalPages - The total number of pages available.
 * @property {number} currentPage - The currently active page.
 * @property {(page: number) => void} onPageChange - Callback function triggered when the page is changed.
 * @property {string} [className] - Optional CSS class names for styling the component.
 *
 * @example
 * const examplePaginationProps: PaginationProps = {
 *   totalPages: 10,
 *   currentPage: 1,
 *   onPageChange: (page) => console.log("Page changed to:", page),
 *   className: "flex text-lg"
 * };
 */
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
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
  name: z
    .string()
    .min(1, "Required")
    .max(100, "Description cannot more than 100 char."),
  school_id: z.number({ message: "Required" }),
  description: z
    .string()
    .min(1, "Required")
    .max(100, "Description cannot more than 100 char."),
});
