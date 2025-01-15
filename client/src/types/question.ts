/**
 * Represents a Question object with its properties.
 *
 * @interface Question
 * @property {string} name - The name of the question.
 * @property {string} category - The category the question belongs to (e.g., Geometry, Algebra).
 * @property {string} difficulty - The difficulty level of the question (e.g., Easy, Medium, Difficult).
 *
 * @example
 * const exampleQuestion: Question = {
 *   name: "Question01_2024",
 *   category: "Geometry Questions",
 *   difficulty: "Difficult"
 * };
 */
interface Question {
  name: string;
  category: string;
  difficulty: string;
}
