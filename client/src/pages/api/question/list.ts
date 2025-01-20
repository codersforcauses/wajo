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
    name: "Question01_2024",
    category: "Geometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question02_2024",
    category: "Algebra Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question03_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    name: "Question04_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question05_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question06_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question07_2024",
    category: "Calculus Questions",
    difficulty: "Easy",
  },
  {
    name: "Question08_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question09_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question10_2024",
    category: "Calculus Questions",
    difficulty: "Easy",
  },
  {
    name: "Question11_2024",
    category: "Calculus Questions",
    difficulty: "Medium",
  },
  {
    name: "Question12_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question13_2024",
    category: "Probability Questions",
    difficulty: "Medium",
  },
  {
    name: "Question14_2024",
    category: "Trigonometry Questions",
    difficulty: "Easy",
  },
  {
    name: "Question15_2024",
    category: "Geometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question16_2024",
    category: "Algebra Questions",
    difficulty: "Medium",
  },
  {
    name: "Question17_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    name: "Question18_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question19_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question20_2024",
    category: "Trigonometry Questions",
    difficulty: "Easy",
  },
  {
    name: "Question21_2024",
    category: "Algebra Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question22_2024",
    category: "Geometry Questions",
    difficulty: "Medium",
  },
  {
    name: "Question23_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    name: "Question24_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question25_2024",
    category: "Probability Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question26_2024",
    category: "Trigonometry Questions",
    difficulty: "Medium",
  },
  {
    name: "Question27_2024",
    category: "Algebra Questions",
    difficulty: "Easy",
  },
  {
    name: "Question28_2024",
    category: "Geometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question29_2024",
    category: "Arithmetic Questions",
    difficulty: "Medium",
  },
  {
    name: "Question30_2024",
    category: "Probability Questions",
    difficulty: "Easy",
  },
  {
    name: "Question31_2024",
    category: "Trigonometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question32_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question33_2024",
    category: "Geometry Questions",
    difficulty: "Easy",
  },
  {
    name: "Question34_2024",
    category: "Algebra Questions",
    difficulty: "Medium",
  },
  {
    name: "Question35_2024",
    category: "Arithmetic Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question36_2024",
    category: "Statistics Questions",
    difficulty: "Easy",
  },
  {
    name: "Question37_2024",
    category: "Calculus Questions",
    difficulty: "Medium",
  },
  {
    name: "Question38_2024",
    category: "Probability Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question39_2024",
    category: "Trigonometry Questions",
    difficulty: "Medium",
  },
  {
    name: "Question40_2024",
    category: "Algebra Questions",
    difficulty: "Easy",
  },
  {
    name: "Question41_2024",
    category: "Geometry Questions",
    difficulty: "Medium",
  },
  {
    name: "Question42_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    name: "Question43_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question44_2024",
    category: "Probability Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question45_2024",
    category: "Trigonometry Questions",
    difficulty: "Easy",
  },
  {
    name: "Question46_2024",
    category: "Algebra Questions",
    difficulty: "Medium",
  },
  {
    name: "Question47_2024",
    category: "Geometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question48_2024",
    category: "Arithmetic Questions",
    difficulty: "Easy",
  },
  {
    name: "Question49_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question50_2024",
    category: "Calculus Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question51_2024",
    category: "Probability Questions",
    difficulty: "Medium",
  },
  {
    name: "Question52_2024",
    category: "Trigonometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question53_2024",
    category: "Algebra Questions",
    difficulty: "Easy",
  },
  {
    name: "Question54_2024",
    category: "Geometry Questions",
    difficulty: "Medium",
  },
  {
    name: "Question55_2024",
    category: "Arithmetic Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question56_2024",
    category: "Statistics Questions",
    difficulty: "Easy",
  },
  {
    name: "Question57_2024",
    category: "Calculus Questions",
    difficulty: "Medium",
  },
  {
    name: "Question58_2024",
    category: "Probability Questions",
    difficulty: "Easy",
  },
  {
    name: "Question59_2024",
    category: "Trigonometry Questions",
    difficulty: "Difficult",
  },
  {
    name: "Question60_2024",
    category: "Statistics Questions",
    difficulty: "Medium",
  },
  {
    name: "Question61_2024",
    category: "Geometry Questions",
    difficulty: "Easy",
  },
  {
    name: "Question62_2024",
    category: "Algebra Questions",
    difficulty: "Medium",
  },
  {
    name: "Question63_2024",
    category: "Arithmetic Questions",
    difficulty: "Difficult",
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
