import axios from "axios";
import { create } from "zustand";

import type { Answer, Question } from "@/types/question.ts";

interface QuestionStore {
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  createQuestion: (newQuestion: Question) => Promise<Question>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],

  fetchQuestions: async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/question/questions/",
      );
      set({ questions: response.data });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  },

  createQuestion: async (newQuestion) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/question/questions/",
        newQuestion,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      set((state) => ({
        questions: [...state.questions, response.data],
      }));

      return response.data;
    } catch (error) {
      console.error("Failed to create question:", error);
      throw new Error("Failed to create question");
    }
  },
}));

interface AnswerStore {
  createAnswer: (answer: Answer) => Promise<void>;
}

export const useAnswerStore = create<AnswerStore>(() => ({
  createAnswer: async (newAnswer) => {
    try {
      await axios.post(
        "http://localhost:8000/api/question/answers/",
        newAnswer,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Failed to create answer:", error);
      throw new Error("Failed to create answer");
    }
  },
}));
