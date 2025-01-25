import React from "react";

import { Button } from "@/components/ui/button";

interface SubmissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTry?: () => void;
  popUpStyle?: "showSubmit" | "showScore";
}

const SubmissionPopup: React.FC<SubmissionPopupProps> = ({
  isOpen,
  onClose,
  onTry,
  popUpStyle = "showSubmit",
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-64 w-96 flex-col items-center justify-center rounded-lg bg-[#FFE8A3] p-6 text-center shadow-lg"
      >
        {popUpStyle === "showSubmit" ? (
          <>
            <h2 className="text-xl font-semibold">Submission Successful!</h2>
            <Button
              variant="outline"
              size="lg"
              className="mt-10"
              onClick={onClose}
            >
              Close
            </Button>
          </>
        ) : popUpStyle === "showScore" ? (
          <>
            <h2 className="text-xl font-semibold">Test Score</h2>
            <h3 className="mt-4">95</h3>
            <div className="mt-10 flex justify-center gap-10">
              <Button variant="outline" size="lg" onClick={onClose}>
                close
              </Button>
              <Button variant="default" size="lg" onClick={onTry}>
                Try Again
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SubmissionPopup;
