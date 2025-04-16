import { Student } from "@/types/user";

/**
 * Example of `Leaderboard`.
 *
 * @example
 * const leaderboard: Leaderboard = {
 *   id: 1,
 *   name: "John Doe",
 *   school: "UWA",
 *   school_email: "john.doe@uwa.edu.au",
 *   user_name: "john_doe",
 *   password: "securePassword123",
 *   individual_score: 85,
 *   team_name: "Team A",
 *   team_score: 150,
 *   status: "Active",
 * };
 */
// export interface Leaderboard {
//   // ask: to be discuss
//   id: number;
//   name: string;
//   participant_students: number;
//   participant_teams: number;
// }

export interface IndividualLeaderboard {
  name: string;
  year_level: number;
  school: string;
  school_type: string;
  is_country: boolean;
  total_marks: number;
}

export interface TeamLeaderboard {
  school: string;
  id: number;
  total_marks: number;
  is_country: boolean;
  students: Student[];
  max_year: number;
}

export interface Ranking {
  student_name: string;
  team: string;
  school: string;
  marks: number;
  response_time: string;
}

export interface Insight {
  question_name: string;
  genre: string;
  difficulty: string;
  correct_rate: number;
}

export interface Insight {
  category: string;
  total: number;
  public_count: number;
  catholic_count: number;
  independent_count: number;
  allies_count: number;
  country: number;
  year_7: number;
  year_8: number;
  year_9: number;
}

export interface QuestionAttempts {
  quiz_name: string;
  student_name: string;
  student_year_level: number;
  question_id: number;
  question_text: string;
  answer_student: string;
  is_correct: boolean;
  marks_awarded: number;
}
