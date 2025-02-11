import { Question } from "@/types/question";

export interface AdminQuiz {
  id: number;
  name: string;
  intro: string;
  total_marks: number;
  is_comp: boolean;
  visible: boolean;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: number;
}

export interface AdminQuizSlot {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  is_comp: boolean;
  visible: boolean;
  open_time_date: Date;
  time_limit: number;
  time_window: number;
  status: number;
  question: Question;
}

export interface Quiz {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
}

export interface QuizSlot {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
}

export enum QuizStatus {
  NormalPractice = 0,
  Upcoming = 1,
  Ongoing = 2,
  Finished = 3,
}

export interface Competition extends Quiz {
  // id: number;
  // name: string;
  // intro: string;
  // total_marks: string;
  open_time_date: Date; // need from server
  status: QuizStatus; // to be discuss
}

export interface CompetitionSlot {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
}

export interface QuestionAttempt {
  id: number;
  answer_student: number;
  is_correct: boolean;
  student: number;
  question: number;
  quiz_attempt: number;
}

export interface QuizAttempt {
  id: number;
  current_page: number;
  state: number;
  time_start: Date;
  time_finish: Date;
  time_modified: Date;
  total_marks: number;
  quiz: number;
  student: number;
  team: number;
}

export interface QuizSlot {
  id: number;
  question: Question;
  slot_index: number;
  block: number;
  quiz: number;
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
