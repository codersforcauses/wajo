/**
 * API Route Handler for fetching quiz data.
 *
 * This handler responds to API requests by returning mock quiz data.
 * It is used to simulate the backend behavior and serve static quiz data.
 *
 * @fileoverview API endpoint located at `/api/quiz` for fetching mock quiz data.
 *
 * @module /api/quiz
 * @see {@link https://nextjs.org/docs/pages/building-your-application/routing/api-routes | Next.js API Routes Documentation}
 */
import { NextApiRequest, NextApiResponse } from "next";

import { AdminQuiz } from "@/types/quiz";

// Mock data representing question entries
const mockQuiz: AdminQuiz = {
  id: 1,
  name: "Quiz_2024",
  open_time_date: new Date("2024-10-01T00:00:00Z"),
  time_limit: 100,
  is_comp: true,
  time_window: 15,
  status: 1,
  //   questions: [
  //     {
  //       id: 1,
  //       name: "Question01_2024",
  //       genre: "Geometry",
  //       difficulty: "Difficult",
  //       question:
  //         "The regular hexagon ABCDEF shown, has area 24. What is the area of △ABD?",
  //       answer: "8",
  //       solution: `Let O be the centre of the hexagon. Diagonals AD, BE and CF, pass through O and partition ABCDEF into six congruent equilateral triangles, each of area 24/6 = 4. Observe that BD partitions each of △BCO and △CDO into two triangles of equal area. A X B O E D F C
  // ∴ |ABD| = |ABO| + |OBD|
  // = |ABO| + |CBO|
  // = 4 + 4
  // = 8.
  // Alternatively, drop perpendicular from O to X on AB. Then OX partitions △ABO
  // into two smaller congruent triangles, so that now △ADB is partitioned by OX, OB
  // and OC into four triangles congruent to OAX, i.e.
  // |ABD| = 4|OAX|
  // = 4 ·
  // 1
  // 2
  // · |ABO|
  // = 8.
  // `,
  //       marks: 1,
  //       block: "A",
  //     },
  //     {
  //       id: 2,
  //       name: "Question02_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 3,
  //       name: "Question03_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "After 15 women leave a party, there are 3 times as many men as women. Later 40 men leave, so that then 7 times as many women as men remain. How many women were there at the start of the party?",
  //       answer: "29",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 4,
  //       name: "Question04_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `. Emilia wants to learn her multiplication tables up to 12.
  // She already knows her multiplication tables up to 6,
  // and she knows that multiplication is commutative.
  // How many products will she have to memorise (on top of the ones she already knows)?
  // Notes.
  // • By multiplication tables up to n we mean all products a × b where a and b are
  // integers from 1 to n.
  // • To say that multiplication is commutative, means that the order of the factors of
  // the product doesn’t matter, i.e. a × b = b × a. So, once Emilia has learnt the value
  // of a × b, she has effectively also learnt the value of b × a.`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 5,
  //       name: "Question05_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `The numbers 146, a, b, c, d, 339 form an arithmetic sequence (these numbers need not all be integers).
  // What is a + b + c + d?
  // Note. Numbers x1, x2, x3, . . . , xn form an arithmetic sequence, if the difference between consecutive terms is some constant ∆, that is,
  // ∆ = x2 − x1 = x3 − x2 = · · · = xn − xn−1.
  // For such a sequence, ∆ is called the common difference.
  // For example, 1, 3, 5, 7 form an arithmetic sequence with common difference 2`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 2,
  //       block: "B",
  //     },
  //     {
  //       id: 6,
  //       name: "Question06_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `Call a positive integer lightweight, if the product of its digits is less than the sum of its digits.
  // How many lightweight positive integers less than 100 are there?`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 7,
  //       name: "Question07_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `A calculator used to sell for $200 but then the price increased by x%.
  // Fortunately, a sale is on now with a price reduction of x% and the calculator is now selling for $182.
  // What is x?`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 8,
  //       name: "Question08_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `. In a rectangle ABCD with length 140 and width 105, let the feet of the perpendiculars dropped from A and C to the diagonal BD be X and Y , respectively.
  // Find the distance XY .`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 9,
  //       name: "Question09_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `Bella went for a work-out around a square park of side 400 metres.
  // Along the first side, she walked at 6 km/h.
  // Then she jogged along the second side at 12 km/h.
  // Along the third side she sprinted at 18 km/h.
  // Along the final side, Bella rode her bicycle at a furious 36 km/h.
  // How many km/h was Bella’s average speed around the block?`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 10,
  //       name: "Question10_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 11,
  //       name: "Question11_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 12,
  //       name: "Question12_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 13,
  //       name: "Question13_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 14,
  //       name: "Question14_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 15,
  //       name: "Question15_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question:
  //         "How many digits are needed to write the expression 8^7 × 5^25 in full?",
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 1,
  //       block: "B",
  //     },
  //     {
  //       id: 16,
  //       name: "Question16_2024",
  //       genre: "Algebra",
  //       difficulty: "Easy",
  //       question: `Consider a quarter-circle OAB of radius 92, with centre O, and perpendicular radii OA and OB.
  // Inside quarter-circle OAB are drawn a semicircle with diameter OB and a small circle.
  // The small circle touches:
  // the semicircle externally at one point, and the quarter-circle at a point on OA and a point on arc AB.
  // What is the radius of the small circle?`,
  //       answer: "16",
  //       solution: `I said so`,
  //       marks: 4,
  //       block: "B",
  //     },
  //   ],
  // totalQuestions: 2,
  total_marks: 40,
  // blocks: ["A", "B"],
  intro: "Answer all questions within the given time.",
  // quizType: "Competition",
  visible: true,
};

/**
 * Handles API requests to fetch quiz data.
 *
 * @function
 * @name handler
 * @param {NextApiRequest} _req - The API request object.
 * @param {NextApiResponse<AdminQuiz[]>} res - The API response object to return the quiz data.
 *
 * @returns {void} Responds with a status code of 200 and the mock quiz data in JSON format.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<AdminQuiz>,
): void {
  res.status(200).json(mockQuiz);
}
