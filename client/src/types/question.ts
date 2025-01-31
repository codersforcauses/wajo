import { ReactNode } from "react";
import { z } from "zod";

export interface Category {
  id: number;
  genre: string;
  info: string;
}

/**
 * Represents a Question object with its properties.
 *
 * @interface Question
 * @property {number} id
 * @property {string} name - The name of the question.
 * @property {string} category - The category the question belongs to (e.g., Geometry, Algebra).
 * @property {string} difficulty - The difficulty level of the question (e.g., Easy, Medium, Difficult).
 *
 * @example
 * const exampleQuestion: Question = {
 *   id: 1,
 *   name: "Question01_2024",
 *   category: "Geometry Questions",
 *   difficulty: "Difficult"
 * };
 */
export interface Question {
  id: number;
  name: string;
  created_by: string;
  modified_by: string;
  category: Category[]; // ask: to be discussed
  is_comp: boolean;
  answer: number[];
  question_text: string;
  note: string;
  answer_text: string;
  diff_level: number;
  layout: string;
  mark: number;
  time_created: Date;
  time_modified: Date;
  image: number;
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

/**
 * Zod schema for validating a question creation input.
 *
 * Ensures that each question has a non-negative integer ID and a non-empty name.
 *
 * @constant
 */
const createQuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1, "Question name is required"),
});

/**
 * Zod schema for validating a question block.
 *
 * Ensures that each question block has a non-negative integer ID and at least one question.
 *
 * @constant
 */
const createQuestionBlockSchema = z.object({
  id: z.number().int().nonnegative(),
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});

/**
 * Zod schema for validating generic test creation input.
 *
 * Validates name, general instructions, and at least one question block.
 *
 * @constant
 */
export const genericCreateTestSchema = z.object({
  name: z.string().min(1, "Required"),
  general_instructions: z.string().min(1, "Required"),
  blocks: z
    .array(createQuestionBlockSchema)
    .min(1, "At least one question block is required"), // An array of question blocks
});

/**
 * Zod schema for validating competition creation input.
 *
 * Extends the generic test schema and ensures that the start time is earlier than the end time.
 *
 * @constant
 */
export const createCompetitionSchema = genericCreateTestSchema
  .extend({
    start_time: z.date(),
    end_time: z.date(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time must be earlier than end time.",
    path: ["start_time"], // optional: Specify which field the error applies to
  });

/**
 * Zod schema for validating practice creation input.
 *
 * Extends the generic test schema with additional validations for `hours` and `minutes`.
 *
 * @constant
 */
export const createPracticeSchema = genericCreateTestSchema.extend({
  hours: z
    .number()
    .min(0, "Number must be at least 0")
    .max(24, "Number must be at most 24"),
  minutes: z
    .number()
    .min(0, "Number must be at least 0")
    .max(60, "Number must be at most 60"),
});
