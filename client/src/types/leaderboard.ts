/**
 * Example of `LeaderboardStatus`.
 *
 * @example
 * const status: LeaderboardStatus = "Active";
 */
export type LeaderboardStatus = "Active" | "Inactive";

/**
 * Example of `Leaderboard`.
 *
 * @example
 * const leaderboard: Leaderboard = {
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
export type Leaderboard = {
  name: string;
  school: string;
  school_email: string;
  user_name: string;
  password: string;
  individual_score: number;
  team_name: string;
  team_score: number;
  status: LeaderboardStatus;
};
