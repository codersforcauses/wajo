/**
 * API Route Handler for fetching team data.
 *
 * This handler responds to API requests by returning a mock list of teams.
 * It is used to simulate the backend behavior and serve static team data.
 *
 * @fileoverview API endpoint located at `/api/teams` for fetching mock team data.
 *
 * @module /api/teams
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

// Mock data representing team entries
const mockTeams: Team[] = Array.from({ length: 20 }, (_, index) => ({
  teamId: `Team${index + 1}_2024`,
  name: `Team ${String.fromCharCode(65 + index)}`,
  studentName: `Student ${index + 1}`,
  schoolName: `School ${index + 1}`,
  competitionPeriod: "2024",
}));

/**
 * Handles API requests to fetch team data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Team[]>} res - The API response object to return the team data.
 *
 * @returns {void} Responds with a status code of 200 and the mock team data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Team[]>,
): void {
  res.status(200).json(mockTeams);
}
