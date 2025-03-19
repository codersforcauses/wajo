"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date; // A future date/time when the countdown should end
  onComplete?: () => void;
  className?: string;
}

export default function CountdownTimer({
  targetDate,
  onComplete,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setIsComplete(false);
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
        return null; // Return null to indicate we should clear the interval
      }

      // Convert to seconds
      const secondsLeft = Math.floor(difference / 1000);
      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft - hours * 3600) / 60);
      const seconds = secondsLeft % 60;

      // Check if less than or equal to 5 minutes
      if (secondsLeft <= 300) {
        setIsWarning(true);
      } else {
        setIsWarning(false);
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    // Calculate initial time left
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    // Don't set up interval if already complete
    if (initialTimeLeft === null) {
      return;
    }

    // Set up interval to update every second
    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if complete
      if (newTimeLeft === null) {
        clearInterval(timerId);
      }
    }, 1000);
  }, []);

  return (
    <div className={className}>
      <div
        className={`rounded-full ${isWarning ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-green-500 to-green-700"} animate-gradient px-6 py-2 font-semibold text-white`}
      >
        Time Left: {timeLeft ?? "00:00:00"}
      </div>
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
