/**
 * API Route Handler for fetching leaderboard data.
 *
 * This handler responds to API requests by returning a mock list of leaderboard data.
 * It is used to simulate the backend behavior and serve static leaderboard data.
 *
 * @fileoverview API endpoint located at `/api/leaderboards` for fetching mock leaderboard data.
 *
 * @module /api/leaderboards
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */
import { NextApiRequest, NextApiResponse } from "next";

import { Leaderboard } from "@/types/leaderboard";

// Mock data representing leaderboard entries
const mockLeaderboards: Partial<Leaderboard>[] = [
  {
    name: "Competition 2020",
    participant_students: 100,
    participant_teams: 25,
  },
  {
    name: "Competition 2021",
    participant_students: 88,
    participant_teams: 22,
  },
  {
    name: "Competition 2022",
    participant_students: 40,
    participant_teams: 10,
  },
  {
    name: "Competition 2023",
    participant_students: 72,
    participant_teams: 18,
  },
  {
    name: "Competition 2024",
    participant_students: 100,
    participant_teams: 25,
  },
  {
    name: "Question06_2024",
    participant_students: 100,
    participant_teams: 25,
  },
];

/**
 * Handles API requests to fetch leaderboard data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Leaderboard[]>} res - The API response object to return the leaderboard data.
 *
 * @returns {void} Responds with a status code of 200 and the mock leaderboard data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Leaderboard[]>,
): void {
  res.status(200).json(mockLeaderboards as Leaderboard[]);
}
