export type LeaderboardStatus = "Active" | "Inactive";

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
