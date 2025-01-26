/**
 * API Route Handler for fetching ranking data.
 *
 * This handler responds to API requests by returning a mock list of ranking data.
 * It is used to simulate the backend behavior and serve static ranking data.
 *
 * @fileoverview API endpoint located at `/api/ranking` for fetching mock ranking data.
 *
 * @module /api/rankings
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */
import { NextApiRequest, NextApiResponse } from "next";

import { Ranking } from "@/types/leaderboard";

// Mock data representing ranking entries
const mockRankings: Ranking[] = [
  {
    student_name: "Alice Johnson",
    team: "Alpha Warriors",
    school: "Greenwood High",
    marks: 95,
    response_time: "00:02:35", // HH:mm:ss
  },
  {
    student_name: "Bob Smith",
    team: "Beta Titans",
    school: "Maple Valley Academy",
    marks: 88,
    response_time: "00:03:10",
  },
  {
    student_name: "Catherine Lee",
    team: "Gamma Defenders",
    school: "Sunrise College",
    marks: 76,
    response_time: "00:04:20",
  },
  {
    student_name: "David Chen",
    team: "Delta Avengers",
    school: "Hillside International",
    marks: 89,
    response_time: "00:02:50",
  },
  {
    student_name: "Evelyn Martin",
    team: "Epsilon Challengers",
    school: "Lakeside Academy",
    marks: 92,
    response_time: "00:03:05",
  },
];

/**
 * Handles API requests to fetch ranking data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Ranking[]>} res - The API response object to return the ranking data.
 *
 * @returns {void} Responds with a status code of 200 and the mock ranking data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Ranking[]>,
): void {
  res.status(200).json(mockRankings as Ranking[]);
}
