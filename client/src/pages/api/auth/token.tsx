/**
 * API Route Handler for user login and token generation.
 *
 * This handler processes login requests by validating the credentials and
 * returning mock access and refresh tokens if the credentials are correct.
 * If the credentials are incorrect or the request method is not POST,
 * it returns an error message.
 *
 * @fileoverview API endpoint located at `/api/auth/token` for handling user login.
 *
 * @module /api/auth/token
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Mock data representing the login response containing access and refresh tokens.
 *
 * @constant {Object}
 * @property {string} access - The mock access token returned for successful login.
 * @property {string} refresh - The mock refresh token returned for successful login.
 */
const mockLoginResponse = {
  access: "mock-access-token",
  refresh: "mock-refresh-token",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123#") {
      res.status(200).json(mockLoginResponse);
    } else {
      res.status(401).json({
        detail:
          "Invalid credentials. See src/pages/api/auth/token for valid login.",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
