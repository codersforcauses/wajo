import { Question } from "./question";

/**
 * Represents a Quiz object with its properties.
 *
 * @interface Quiz
 * @property {string} name - The name of the quiz.
 * @property {datetime} startTime - The start time of the quiz.
 * @property {number} duration - The duration of the quiz in minutes.
 * @property {Question[]} questions - The list of questions in the quiz.
 * @property {number} totalQuestions - The total number of questions in the quiz.
 * @property {number} totalMarks - The total marks available in the quiz.
 * @property {string} quizInstructions - The specifc instructions for the quiz.
 * @property {enum} quizType - The type of quiz (e.g., Competition, Practice).
 * @property {boolean} isPublished - The status of the quiz (e.g., Published, Unpublished).
 *
 *
 *
 *
 * @example
 * const exampleQuiz: Quiz = {
 *   name: "Quiz_2024",
 *   startTime: "2024-10-01T00:00:00Z",
 *   duration: 100,
 *   questions: [
 *    { name: "Question01_2024", genre: "Geometry Questions", difficulty: "Difficult", marks: 1, block: "A" },
 *    { name: "Question02_2024", genre: "Algebra Questions", difficulty: "Easy", marks: 1, block: "B"  },
 *  ],
 *  totalQuestions: 2,
 *  totalMarks: 100,
 *  blocks: ["A", "B"],
 *  quizInstructions: "Answer all questions within the given time.",
 *  quizType: "Competition",
 *  isPublished: true
 * };
 */
export interface Quiz {
  id: number;
  name: string;
  startTime: Date;
  duration: number;
  questions: QuizQuestion[];
  totalQuestions: number;
  totalMarks: number;
  blocks: string[];
  quizInstructions: string;
  is_comp: boolean;
  isPublished: boolean;
}

export interface QuizQuestion extends Question {
  marks: number;
  block: string;
}

/**
 * Represents the properties for the GenericQuiz component.
 *
 * @interface GenericQuizProps
 * @property {Quiz} quiz - The quiz object with data to display in the quiz.
 * @property {(updatedData: Quiz) => void} onDataChange - Callback function triggered when the data is updated.
 * @property {number} changePage - The current page of the data grid.
 *
 * @example
 * const exampleGenericQuizProps: GenericQuizProps = {
 *   quiz: {
 *     name: "Quiz_2024",
 *     startTime: "2024-10-01T00:00:00Z",
 *     duration: 100,
 *     questions: [
 *      { name: "Question01_2024", genre: "Geometry Questions", difficulty: "Difficult" },
 *      { name: "Question02_2024", genre: "Algebra Questions", difficulty: "Easy" }
 *    ],
 *    totalQuestions: 2,
 *    totalMarks: 100,
 *    quizInstructions: "Answer all questions within the given time.",
 *    quizType: "Competition",
 *    isPublished: true
 *   };
 *  onDataChange: (updatedData) => console.log("Updated data:", updatedData),
 *  changePage: 1
 */
interface GenericQuizProps {
  quiz: Quiz;
  onDataChange: (updatedData: Quiz) => void;
  changePage: number;
}
