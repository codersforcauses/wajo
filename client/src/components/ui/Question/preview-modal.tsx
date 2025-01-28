import "katex/dist/katex.min.css";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PreviewModalProps } from "@/types/question";

import { Button } from "../button";

export default function PreviewModal({
  children,
  dataContext,
}: PreviewModalProps) {
  const [question, setQuestion] = useState<string>(dataContext.question);

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
          className="flex h-auto w-[95%] max-w-[750px] flex-col items-center rounded-[40px] border-0 bg-accent p-1 shadow-lg"
          style={{ borderRadius: "32px" }}
        >
          <VisuallyHidden.Root>
            <DialogTitle>Preview Data</DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>

          <div className="flex h-full w-full flex-col space-y-4 rounded-[30px] bg-white px-10 py-4 text-xl">
            {/* Question */}
            <div className="flex-grow space-y-4">
              <div className="flex space-x-4 text-2xl font-semibold text-gray-600">
                <span>{dataContext.questionName}</span>
                <span>[{dataContext.mark} marks]</span>
              </div>
              <Latex>{question}</Latex>
            </div>
            {/* Solution */}
            <div>
              <p className="text-2xl font-semibold text-gray-600">Solution</p>
              <div>
                <p>
                  Answer:{" "}
                  <span className="font-bold">{dataContext.answer}</span>
                </p>
                <p>{dataContext.solution}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-auto flex justify-center">
              <DialogTrigger asChild>
                <Button variant={"ghost"} className="w-36 border border-black">
                  Close
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
