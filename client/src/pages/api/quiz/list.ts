/**
 * API Route Handler for fetching quiz question data.
 *
 * This handler responds to API requests by returning a mock list of questions related to a quiz.
 * It is used to simulate the backend behavior and serve static quiz question data.
 *
 * @fileoverview API endpoint located at `/api/quiz` for fetching mock quiz question data.
 *
 * @module /api/quiz
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */

import { NextApiRequest, NextApiResponse } from "next";

// Mock data representing question entries
const mockQuizzes: Quiz[] = [
  {
    name: "Quiz_2024",
    startTime: new Date("2024-10-01T00:00:00Z"),
    duration: 100,
    questions: [
      {
        name: "Question01_2024",
        category: "Geometry Questions",
        difficulty: "Difficult",
      },
      {
        name: "Question02_2024",
        category: "Algebra Questions",
        difficulty: "Easy",
      },
    ],
    totalQuestions: 2,
    totalMarks: 100,
    quizInstructions: "Answer all questions within the given time.",
    quizType: "Competition",
    isPublished: true,
  },
  {
    name: "Quiz_2025",
    startTime: new Date("2025-10-01T00:00:00Z"),
    duration: 120,
    questions: [
      {
        name: "Question01_2025",
        category: "Geometry Questions",
        difficulty: "Medium",
      },
      {
        name: "Question02_2025",
        category: "Algebra Questions",
        difficulty: "Medium",
      },
    ],
    totalQuestions: 2,
    totalMarks: 100,
    quizInstructions: "Answer all questions within the given time.",
    quizType: "Competition",
    isPublished: true,
  },
  {
    name: "Quiz_2026",
    startTime: new Date("2026-10-01T00:00:00Z"),
    duration: 90,
    questions: [
      {
        name: "Question01_2026",
        category: "Geometry Questions",
        difficulty: "Easy",
      },
      {
        name: "Question02_2026",
        category: "Algebra Questions",
        difficulty: "Difficult",
      },
    ],
    totalQuestions: 2,
    totalMarks: 100,
    quizInstructions: "Answer all questions within the given time.",
    quizType: "Competition",
    isPublished: true,
  },
];

/**
 * Handles API requests to fetch quiz data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<Quiz[]>} res - The API response object to return the quiz data.
 *
 * @returns {void} Responds with a status code of 200 and the mock quiz data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Quiz[]>,
): void {
  res.status(200).json(mockQuizzes);
}
