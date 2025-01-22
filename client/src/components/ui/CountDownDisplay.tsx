import React from "react";

interface CountdownDisplayProps {
  timeLeft: number | null;
}

const formatTime = (timeLeft: number) => {
  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft }) => {
  return (
    <div>
      {timeLeft !== null ? (
        <div className="rounded-full bg-green-500 px-6 py-2 text-lg font-semibold text-white shadow-md">
          Time Left: {formatTime(timeLeft)}
        </div>
      ) : (
        <h2>Click "Start Quiz" to begin</h2>
      )}
    </div>
  );
};

export default CountdownDisplay;
