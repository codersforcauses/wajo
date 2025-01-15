/**
 * API Route Handler for fetching team data.
 *
 * This handler responds to API requests by returning a mock list of teams.
 * It simulates backend behavior and serves static team data for demonstration purposes.
 *
 * @fileoverview API endpoint located at `/api/users/team` for fetching mock team data.
 *
 * @module /api/users/team
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Team } from "@/types/team";

/**
 * Mock data representing team entries.
 *
 * @constant {Partial<Team>[]}
 */
const mockTeams: Partial<Team>[] = [];
for (let i = 0; i < 9; i++) {
  mockTeams.push(
    {
      id: i * 3 + 1,
      name: `Team Alpha ${i + 1}`,
      school: "Greenfield High",
      description: `A description for Team Alpha ${i + 1}.`,
      time_created: new Date(`2025-01-01T12:00:00Z`),
    },
    {
      id: i * 3 + 2,
      name: `Team Beta ${i + 1}`,
      school: "Westwood Academy",
      description: `A description for Team Beta ${i + 1}.`,
      time_created: new Date(`2025-01-01T13:00:00Z`),
    },
    {
      id: i * 3 + 3,
      name: `Team Gamma ${i + 1}`,
      school: "Northside School",
      description: `A description for Team Gamma ${i + 1}.`,
      time_created: new Date(`2025-01-01T14:00:00Z`),
    },
  );
}

/**
 * Handles API requests to fetch teams data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object. This parameter is not used in this handler.
 * @param {NextApiResponse<Team[]>} res - The API response object to return the team data.
 *
 * @returns {void} Responds with a status code of 200 and the mock team data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Team[]>,
): void {
  res.status(200).json(mockTeams as Team[]);
}
