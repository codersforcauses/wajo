import { ReactNode } from "react";
import { z } from "zod";

export interface Category {
  id: number;
  genre: string;
  info: string;
}

export interface CategoryPaged {
  count: number;
  next: string;
  previous: string;
  results: Category[];
}

export interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}
/**
 * Represents a Question object with its properties.
 *
 * @interface Question
 * @property {number} id
 * @property {string} name - The name of the question.
 * @property {string} categories - The category/genre the question belongs to (e.g., Geometry, Algebra).
 * @property {string} diff_level - The difficulty level of the question (e.g., Easy, Medium, Difficult).
 * @property {number} mark - The number of marks assigned to the question.
 *
 * @example
 * const exampleQuestion: Question = {
 *   id: 1,
 *   name: "Question01_2024",
 *   genre: "Geometry",
 *   difficulty: "Difficult"
 * };
 */
export interface Question {
  id: number;
  name: string;
  created_by: string;
  modified_by: string;
  categories: Category[]; // ask: to be discussed
  is_comp: boolean;
  answers: Answer[];
  question_text: string;
  note: string;
  solution_text: string;
  diff_level: number;
  layout: Layout;
  mark: number;
  time_created: Date;
  time_modified: Date;
  images: QuestionImage[];
}

export interface QuestionPaged {
  count: number;
  next: string;
  previous: string;
  results: Question[];
}

export interface QuestionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

export interface QuestionImage {
  url: string;
  question: number;
}

export interface Answer {
  value: number;
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
 * };
 */
export interface PreviewModalDataContext {
  questionName: string;
  question: string;
  answer: string;
  solution: string;
  mark: string;
  image: string | null;
  layout: Layout;
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
  setLayout: (layout: Layout) => void; // Function to update form state
}

export interface DeleteModalProps {
  baseUrl: string;
  id: number;
  entity: string;
  children: ReactNode;
  onSuccess?: () => void;
}

export const createCategorySchema = z.object({
  genre: z.string().min(1, "Genre is required"),
  info: z.string().min(1, "Info is required"),
});

/**
 * Zod schema for validating a question creation input.
 *
 * Ensures that each question has a non-negative integer ID and a non-empty name.
 *
 * @constant
 */

export const LayoutEnum = z.enum(["top", "bottom", "left", "right"], {
  errorMap: () => ({ message: "Invalid Layout" }),
});

export enum Layout {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

// Define the schema for the request payload
export const createQuestionSchema = z.object({
  questionName: z.string().min(1, "Question Name is required"),
  question: z.string().min(1, "Question is required"),
  answers: z
    .string()
    .min(1, "Answer is required")
    .refine(
      (val) =>
        val
          .split(",")
          .every(
            (num) =>
              /^\d+$/.test(num.trim()) &&
              +num.trim() >= 0 &&
              +num.trim() <= 999,
          ),
      {
        message:
          "Must be an integer from 0-999, use “,” to separate multiple answers",
      },
    ),
  solution_text: z.string().optional(),
  mark: z
    .string()
    .min(1, "Mark is required")
    .regex(/^\d+$/, "Mark must be a number"),
  difficulty: z
    .string()
    .min(1, "Difficulty is required")
    .refine((val) => /^[1-9]$|^10$/.test(val), {
      message: "Difficulty must be a number between 1 and 10",
    }),
  genre: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  // .min(1, "Genre is required"),
  note: z.string().optional(),
  image: z.string().optional(),
  layout: LayoutEnum.optional().default("top"),
});
