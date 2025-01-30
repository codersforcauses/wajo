/**
 * API Route Handler for fetching insight data.
 *
 * This handler responds to API requests by returning a mock list of insights.
 * It is used to simulate the backend behavior and serve static insight data.
 *
 * @fileoverview API endpoint located at `/api/insights` for fetching mock insight data.
 *
 * @module /api/insights
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Insight } from "@/types/leaderboard";

// Mock data representing insight entries
const mockInsights: Insight[] = [
  {
    question_name: "What is the capital of France?",
    genre: "Geography",
    difficulty: "Easy",
    correct_rate: 0.9, // 90%
  },
  {
    question_name: "Solve x^2 - 5x + 6 = 0.",
    genre: "Mathematics",
    difficulty: "Medium",
    correct_rate: 0.75, // 75%
  },
  {
    question_name: "What is the chemical symbol for Gold?",
    genre: "Science",
    difficulty: "Easy",
    correct_rate: 0.85, // 85%
  },
  {
    question_name: "Who wrote 'Hamlet'?",
    genre: "Literature",
    difficulty: "Hard",
    correct_rate: 0.6, // 60%
  },
  {
    question_name: "What year did World War II end?",
    genre: "History",
    difficulty: "Medium",
    correct_rate: 0.8, // 80%
  },
];

/**
 * Handles API requests to fetch insight data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Insight[]>} res - The API response object to return the insight data.
 *
 * @returns {void} Responds with a status code of 200 and the mock insight data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Insight[]>,
): void {
  res.status(200).json(mockInsights as Insight[]);
}
