import { ReactNode } from "react";

/**
 * Represents a Question object with its properties.
 *
 * @interface Question
 * @property {string} name - The name of the question.
 * @property {string} category - The category the question belongs to (e.g., Geometry, Algebra).
 * @property {string} difficulty - The difficulty level of the question (e.g., Easy, Medium, Difficult).
 *
 * @example
 * const exampleQuestion: Question = {
 *   name: "Question01_2024",
 *   category: "Geometry Questions",
 *   difficulty: "Difficult"
 * };
 */
export interface Question {
  name: string;
  category: string;
  difficulty: string;
}

/**
 * Represents the properties for the Datagrid component.
 *
 * @interface DatagridProps
 * @property {Question[]} datacontext - The list of questions to display in the data grid.
 * @property {(updatedData: Question[]) => void} onDataChange - Callback function triggered when the data is updated.
 * @property {number} changePage - The current page of the data grid.
 *
 * @example
 * const exampleDatagridProps: DatagridProps = {
 *   datacontext: [
 *     { name: "Question01_2024", category: "Geometry Questions", difficulty: "Difficult" },
 *     { name: "Question02_2024", category: "Algebra Questions", difficulty: "Easy" }
 *   ],
 *   onDataChange: (updatedData) => console.log("Data updated:", updatedData),
 *   changePage: 1
 * };
 */
export interface DatagridProps<T> {
  datacontext: T[];
  onDataChange: (updatedData: T[]) => void;
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
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Represents the data context used within the PreviewModal component.
 *
 * @interface PreviewModalDataContext
 * @property {string} questionName - The name or title of the question.
 * @property {string} question - The detailed content of the question.
 * @property {string} answer - The correct answer(s) to the question.
 * @property {string} solution - A detailed explanation or solution for the question.
 * @property {string} mark - The number of marks assigned to the question.
 * @property {string} difficulty - The difficulty level of the question (e.g., Easy, Medium, Hard).
 * @property {string} genre - The category or type of the question (e.g., Math, Science).
 *
 * @example
 * const exampleContext: PreviewModalDataContext = {
 *   questionName: "Question01_2024",
 *   question: "What is the sum of 2 and 3?",
 *   answer: "5",
 *   solution: "Adding 2 and 3 gives 5.",
 *   mark: "5",
 *   difficulty: "Easy",
 *   genre: "Arithmetic"
 * };
 */
export interface PreviewModalDataContext {
  questionName: string;
  question: string;
  answer: string;
  solution: string;
  mark: string;
  difficulty: string;
  genre: string;
}

/**
 * Represents the properties for the PreviewModal component.
 *
 * @interface PreviewModalProps
 * @property {ReactNode} children - The child components to render inside the modal (e.g., buttons or triggers).
 * @property {PreviewModalDataContext} dataContext - The context containing the data to display in the modal.
 *
 * @see {@link https://github.com/codersforcauses/wajo/pull/29} for more details.
 *
 * @example
 * const exampleProps: PreviewModalProps = {
 *   children: <button>Preview</button>,
 *   dataContext: {
 *     questionName: "Question01_2024",
 *     question: "What is the capital of France?",
 *     answer: "Paris",
 *     solution: "The capital of France is Paris.",
 *     mark: "10",
 *     difficulty: "Medium",
 *     genre: "Geography"
 *   },
 * };
 */
export interface PreviewModalProps {
  children: ReactNode;
  dataContext: PreviewModalDataContext;
}

export interface DeleteModalProps {
  children: ReactNode;
  data: Question;
}
