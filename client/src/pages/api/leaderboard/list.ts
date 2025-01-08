/**
 * API Route Handler for fetching leaderboard data.
 *
 * This handler responds to API requests by returning a mock list of leaderboards.
 * It is used to simulate the backend behavior and serve static leaderboard data.
 *
 * @fileoverview API endpoint located at `/api/list` for fetching mock leaderboard data.
 *
 * @module /api/leaderboard/list
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Leaderboard } from "@/types/leaderboard";

/**
 * Mock data representing leaderboard entries.
 *
 * @constant {Leaderboard[]}
 */
const mockLeaderboards: Leaderboard[] = [
  {
    name: "John Doe",
    school: "Springfield High",
    school_email: "john.doe@springfield.edu",
    user_name: "johndoe",
    password: "securepassword",
    individual_score: 95,
    team_name: "Team A",
    team_score: 320,
    status: "Active",
  },
  {
    name: "Jane Smith",
    school: "Shelbyville Academy",
    school_email: "jane.smith@shelbyville.edu",
    user_name: "janesmith",
    password: "anothersecurepassword",
    individual_score: 88,
    team_name: "Team B",
    team_score: 290,
    status: "Active",
  },
  {
    name: "Alice Johnson",
    school: "Ridgeview College",
    school_email: "alice.johnson@ridgeview.edu",
    user_name: "alicejohnson",
    password: "password123",
    individual_score: 78,
    team_name: "Team C",
    team_score: 250,
    status: "Inactive",
  },
];

/**
 * Handles API requests to fetch leaderboard data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object (not used in this handler).
 * @param {NextApiResponse<Leaderboard[]>} res - The API response object to return the leaderboard data.
 *
 * @returns {void} Responds with a status code of 200 and the mock leaderboard data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Leaderboard[]>,
): void {
  res.status(200).json(mockLeaderboards);
}
