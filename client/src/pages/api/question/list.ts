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

import { Question } from "@/types/question";

// Mock data representing question entries
const mockQuestions: Question[] = [
  {
    id: 1,
    name: "Question01_2024",
    category: "Geometry Questions",
    difficulty: "Difficult",
  },
  {
    id: 2,
    name: "Question02_2024",
    category: "Algebra Questions",
    difficulty: "Difficult",
  },
  {
    id: 3,
    name: "Question03_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    id: 4,
    name: "Question04_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    id: 5,
    name: "Question05_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    id: 6,
    name: "Question06_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    id: 7,
    name: "Question07_2024",
    category: "Calculus Questions",
    difficulty: "Easy",
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
  res.status(200).json(mockQuestions);
}
