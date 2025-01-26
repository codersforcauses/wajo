/**
 * API Route Handler for fetching practice data.
 *
 * This handler responds to API requests by returning a mock list of practice data.
 * It is used to simulate the backend behavior and serve static practice data.
 *
 * @fileoverview API endpoint located at `/api/practices` for fetching mock practice data.
 *
 * @module /api/practices
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */
import { NextApiRequest, NextApiResponse } from "next";

// Mock data representing practice entries
import { Practice } from "@/types/practice";

const mockPractices: Partial<Practice>[] = [
  {
    name: "Practice01_2024",
    status: "Published",
  },
  {
    name: "Practice02_2024",
    status: "Unpublished",
  },
  {
    name: "Practice03_2024",
    status: "Unpublished",
  },
  {
    name: "Practice04_2024",
    status: "Published",
  },
  {
    name: "Practice05_2024",
    status: "Published",
  },
  {
    name: "Practice06_2024",
    status: "Unpublished",
  },
];

/**
 * Handles API requests to fetch practice data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Practice[]>} res - The API response object to return the practice data.
 *
 * @returns {void} Responds with a status code of 200 and the mock practice data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Practice[]>,
): void {
  res.status(200).json(mockPractices as Practice[]);
}
