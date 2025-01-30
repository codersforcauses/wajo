import { Question } from "@/types/question";

export interface AdminQuiz {
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

export interface Competition {
  id: number;
  name: string;
  intro: string;
  total_marks: string;
  open_time_date: Date; // ask: need from server
  status: QuizStatus; // ask: to be discuss
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
