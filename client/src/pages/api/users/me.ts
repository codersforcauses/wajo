/**
 * API Route Handler for fetching user data.
 *
 * This handler serves mock user data for demonstration purposes.
 * It is accessible at the `/api/users/me` endpoint.
 *
 * @fileoverview Provides an API route for retrieving mock user data.
 * @module api/users/me
 */

import { NextApiRequest, NextApiResponse } from "next";

import { User } from "@/types/user";

/**
 * Mock user data for demonstration purposes.
 *
 * @constant {User}
 */
const mockUser: User = {
  id: 1,
  username: "johndoe",
  // email: "johndoe@example.com",
  first_name: "John",
  last_name: "Doe",
  role: "admin",
  // school: "University of Western Australia",
};

/**
 * API route handler to fetch user data.
 *
 * @function handler
 * @param {NextApiRequest} _req - The incoming API request object. Ignored in this mock implementation.
 * @param {NextApiResponse<User>} res - The outgoing API response object containing the mock user data.
 *
 * @returns {void} Responds with a status code of 200 and the mock user data in JSON format.
 *
 * @example
 * // Example response payload:
 * // {
 * //   "id": 1,
 * //   "username": "johndoe",
 * //   "email": "johndoe@example.com",
 * //   "first_name": "John",
 * //   "last_name": "Doe",
 * //   "role": "admin",
 * //   "school": "University of Western Australia"
 * // }
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<User>,
): void {
  res.status(200).json(mockUser);
}
