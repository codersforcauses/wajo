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
interface Team {
  teamId: string;
  name: string;
  studentName: string;
  schoolName: string;
  competitionPeriod: string;
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
interface TeamDatagridProps {
  datacontext: Team[];
  onDataChange: (updatedData: Team[]) => void;
  changePage: number;
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
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}
