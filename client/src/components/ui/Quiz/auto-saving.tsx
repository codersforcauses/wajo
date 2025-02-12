import React from "react";

interface Props {
  answer: string;
  setAnswer: (value: string) => void;
}

const AutoSavingAnswer: React.FC<Props> = ({ answer, setAnswer }) => {
  return (
    <input
      type="text"
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      placeholder="Please input your answer"
      className="mt-4 h-10 w-full min-w-64 rounded-sm border border-slate-500 px-2"
    />
  );
};

export default AutoSavingAnswer;
