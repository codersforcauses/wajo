/**
 * API Route Handler for fetching question data.
 *
 * This handler responds to API requests by returning a mock list of questions.
 * It is used to simulate the backend behavior and serve static question data.
 *
 * @fileoverview API endpoint located at `/api/questions` for fetching mock question data.
 *
 * @module /api/questions
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Category, Question } from "@/types/question";

// Mock data representing question entries
const mockQuestions: Partial<Question>[] = [
  {
    id: 1,
    name: "Question01_2024",
    category: [{ genre: "Geometry Questions" }] as Category[],
    diff_level: 1,
  },
  {
    id: 2,
    name: "Question02_2024",
    category: [{ genre: "Algebra Questions" }] as Category[],
    diff_level: 3,
  },
  {
    id: 3,
    name: "Question03_2024",
    category: [{ genre: "Arithmetic Questions" }] as Category[],
    diff_level: 1,
  },
  {
    id: 4,
    name: "Question04_2024",
    category: [{ genre: "Statistics Questions" }] as Category[],
    diff_level: 2,
  },
  {
    id: 5,
    name: "Question05_2024",
    category: [{ genre: "Calculus Questions" }] as Category[],
    diff_level: 3,
  },
  {
    id: 6,
    name: "Question06_2024",
    category: [{ genre: "Calculus Questions" }] as Category[],
    diff_level: 3,
  },
  {
    id: 7,
    name: "Question07_2024",
    category: [{ genre: "Calculus Questions" }] as Category[],
    diff_level: 1,
  },
];

/**
 * Handles API requests to fetch question data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Question[]>} res - The API response object to return the question data.
 *
 * @returns {void} Responds with a status code of 200 and the mock question data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Question[]>,
): void {
  res.status(200).json(mockQuestions as Question[]);
}
