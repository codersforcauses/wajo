import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PreviewModalProps } from "@/types/question";

import { Button } from "../button";
import { MathInput } from "../math-input";

export default function PreviewModal({
  children,
  dataContext,
  onClose,
}: PreviewModalProps) {
  const [question, setQuestion] = useState<string>(dataContext.question);
  const [isSolutionVisible, setIsSolutionVisible] = useState<boolean>(true);

  const handleSolutionVisible = () => {
    setIsSolutionVisible(!isSolutionVisible);
  };

  // When close button is clicked, bring the modified question data back to Create page
  const handleDialogClose = () => {
    onClose(question);
  };

  useEffect(() => {
    if (dataContext?.question) {
      setQuestion(dataContext.question);
    }
  }, [dataContext]);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="flex h-full max-h-[750px] w-[95%] max-w-[750px] items-center rounded-[40px] border-0 bg-accent p-1 shadow-lg"
          style={{ borderRadius: "32px" }}
        >
          <VisuallyHidden.Root>
            <DialogTitle>Preview Data</DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>

          <div className="h-full w-full space-y-6 overflow-y-auto rounded-[30px] border-accent bg-white px-10 py-4 text-xl">
            {/* Question */}
            <div className="space-y-4">
              <div className="flex space-x-4 text-2xl font-semibold text-gray-600">
                <span>{dataContext.questionName}</span>
                <span>[{dataContext.mark} marks]</span>
              </div>
              <p></p>
              <MathInput
                input={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              ></MathInput>
            </div>
            {/* Solution */}
            <div
              className={`space-y-2 ${isSolutionVisible ? "" : "invisible"}`}
            >
              <p className="text-2xl font-semibold text-gray-600">Solution</p>
              <div>
                <p>
                  Answer:{" "}
                  <span className="font-bold">{dataContext.answer}</span>
                </p>
                <p>{dataContext.solution}</p>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex justify-evenly">
              <DialogTrigger asChild>
                <Button
                  onClick={handleDialogClose}
                  variant={"ghost"}
                  className="w-36 border border-black"
                >
                  Close
                </Button>
              </DialogTrigger>
              <Button onClick={handleSolutionVisible} className="w-36">
                Hide Solution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
