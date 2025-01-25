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
export interface Leaderboard {
  id: number;
  name: string;
  participant_students: number;
  participant_teams: number;
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
