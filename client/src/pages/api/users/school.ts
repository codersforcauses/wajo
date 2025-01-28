/**
 * API Route Handler for fetching school data.
 *
 * This handler responds to API requests by returning a mock list of schools.
 * It simulates backend behavior and serves static school data for demonstration purposes.
 *
 * @fileoverview API endpoint located at `/api/users/school` for fetching mock school data.
 *
 * @module /api/users/school
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { School } from "@/types/school";

/**
 * Mock data representing school entries.
 *
 * @constant {Partial<School>[]}
 */
const mockSchools: Partial<School>[] = [];
for (let i = 0; i < 11; i++) {
  mockSchools.push(
    {
      id: i * 3 + 1,
      name: `School Alpha ${i + 1}`,
      time_created: new Date(`2025-01-01T12:00:00Z`),
    },
    {
      id: i * 3 + 2,
      name: `School Beta ${i + 1}`,
      time_created: new Date(`2025-01-01T13:00:00Z`),
    },
    {
      id: i * 3 + 3,
      name: `School Gamma ${i + 1}`,
      time_created: new Date(`2025-01-01T14:00:00Z`),
    },
  );
}

/**
 * Handles API requests to fetch schools data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object. This parameter is not used in this handler.
 * @param {NextApiResponse<School[]>} res - The API response object to return the school data.
 *
 * @returns {void} Responds with a status code of 200 and the mock school data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<School[]>,
): void {
  res.status(200).json(mockSchools as School[]);
}
