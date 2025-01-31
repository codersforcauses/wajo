/**
 * API Route Handler for fetching competition data.
 *
 * This handler responds to API requests by returning a mock list of competition data.
 * It is used to simulate the backend behavior and serve static competition data.
 *
 * @fileoverview API endpoint located at `/api/competitions` for fetching mock competition data.
 *
 * @module /api/competitions
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Competition, QuizStatus } from "@/types/quiz";

// Mock data representing competition entries
const mockCompetitions: Partial<Competition>[] = [
  {
    id: 1,
    name: "Competition01_2024",
    status: QuizStatus.NormalPractice,
    open_time_date: new Date(`2025-01-30T10:00:00Z`),
  },
  {
    id: 2,
    name: "Competition02_2024",
    status: QuizStatus.Finished,
    open_time_date: new Date(`2024-01-01T02:00:00Z`),
  },
  {
    name: "Competition03_2024",
    status: QuizStatus.Ongoing,
    open_time_date: new Date(`2025-01-10T18:00:00Z`),
  },
  {
    name: "Competition04_2024",
    status: QuizStatus.Upcoming,
    open_time_date: new Date(`2025-04-15T13:00:00Z`),
  },
  {
    name: "Competition05_2024",
    status: QuizStatus.Finished,
    open_time_date: new Date(`2025-02-01T20:00:00Z`),
  },
  {
    name: "Competition06_2024",
    status: QuizStatus.Upcoming,
    open_time_date: new Date(`2025-01-01T12:00:00Z`),
  },
];

/**
 * Handles API requests to fetch competition data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Competition[]>} res - The API response object to return the competition data.
 *
 * @returns {void} Responds with a status code of 200 and the mock competition data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Competition[]>,
): void {
  res.status(200).json(mockCompetitions as Competition[]);
}
