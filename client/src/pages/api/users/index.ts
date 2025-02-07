/**
 * API Route Handler for fetching user data.
 *
 * This handler responds to API requests by returning a mock list of users.
 * It simulates backend behavior and serves static user data for demonstration purposes.
 *
 * @fileoverview API endpoint located at `/api/users` for fetching mock user data.
 *
 * @module /api/users
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { School, User } from "@/types/user";

/**
 * Mock data representing user entries.
 *
 * @constant {Partial<User>[]}
 */
const mockUsers: Partial<User>[] = [];
for (let i = 0; i < 9; i++) {
  mockUsers.push(
    {
      id: i * 3 + 1,
      username: `adminMaster${i + 1}`,
      role: "user",
      school: { name: "Greenfield High" } as School,
    },
    {
      id: i * 3 + 2,
      username: `mathPro${i + 1}`,
      role: "teacher",
      school: { name: "Westwood Academy" } as School,
    },
    {
      id: i * 3 + 3,
      username: `scienceGeek${i + 1}`,
      role: "student",
      school: { name: "Northside School" } as School,
    },
  );
}

/**
 * Handles API requests to fetch users data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object. This parameter is not used in this handler.
 * @param {NextApiResponse<User[]>} res - The API response object to return the user data.
 *
 * @returns {void} Responds with a status code of 200 and the mock user data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<User[]>,
): void {
  res.status(200).json(mockUsers as User[]);
}
