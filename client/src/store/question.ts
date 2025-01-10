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
    const response = await fetch("http://localhost:8000/api/question/get/");
    const data = await response.json();
    set({ questions: data });
  },

  createQuestion: async (newQuestion) => {
    const response = await fetch("http://localhost:8000/api/question/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    });

    if (!response.ok) {
      throw new Error("Failed to create question");
    }

    const createdQuestion = await response.json();
    set((state) => ({
      questions: [...state.questions, createdQuestion],
    }));

    return createdQuestion;
  },
}));

interface AnswerStore {
  createAnswer: (answer: Answer) => Promise<void>;
}

export const useAnswerStore = create<AnswerStore>((set) => ({
  createAnswer: async (newAnswer) => {
    const response = await fetch(
      "http://localhost:8000/api/question/answer/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnswer),
      },
    );

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      console.error("Backend Error:", errorData);
      throw new Error("Failed to create answer");
    }
  },
}));
