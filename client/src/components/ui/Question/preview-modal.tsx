import "katex/dist/katex.min.css";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  SquareChevronDown,
  SquareChevronLeft,
  SquareChevronRight,
  SquareChevronUp,
} from "lucide-react";
import Image from "next/image";
import Latex from "react-latex-next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout, PreviewModalProps } from "@/types/question";

const ImageControls = ({
  imageUrl,
  onLayoutChange,
}: {
  imageUrl: string;
  onLayoutChange: (position: Layout) => void;
}) => {
  const controls = [
    { Component: SquareChevronUp, position: "-top-5", layout: Layout.TOP },
    { Component: SquareChevronLeft, position: "-left-5", layout: Layout.LEFT },
    {
      Component: SquareChevronRight,
      position: "-right-5",
      layout: Layout.RIGHT,
    },
    {
      Component: SquareChevronDown,
      position: "-bottom-5",
      layout: Layout.BOTTOM,
    },
  ];

  return (
    <div className="relative flex w-fit items-center justify-center">
      <Image
        src={imageUrl}
        alt="Question Image Preview"
        width={200}
        height={300}
        className="h-auto max-h-[30vh] w-auto max-w-[30vw]"
      />
      {controls.map(({ Component, position, layout }) => (
        <Component
          key={layout}
          className={`absolute ${position} h-5 w-5 cursor-pointer`}
          onClick={() => onLayoutChange(layout)}
          strokeWidth={0.5}
        />
      ))}
    </div>
  );
};

export default function PreviewModal({
  children,
  dataContext,
  setLayout,
}: PreviewModalProps) {
  const { questionName, mark, question, image, layout, answer, solution } =
    dataContext;

  const renderImage = (position: Layout) =>
    image &&
    layout === position && (
      <ImageControls imageUrl={image} onLayoutChange={setLayout} />
    );

  const isHorizontalLayout = layout === Layout.LEFT || layout === Layout.RIGHT;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-[90vw] p-2 shadow-lg">
        <ScrollArea className="h-full max-h-[85vh] overflow-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Preview Data</DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
          <div className="flex w-full flex-col space-y-4 bg-accent px-10 py-4 text-xl">
            <div className="flex space-x-4 text-2xl font-semibold text-gray-600">
              <span>{questionName}</span>
              <span>[{mark} marks]</span>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {renderImage(Layout.TOP)}

              <div
                className={`flex ${isHorizontalLayout ? "flex-row items-center space-x-4" : "flex-col items-center space-y-4"}`}
              >
                {renderImage(Layout.LEFT)}
                <div className="flex h-auto w-auto items-center justify-center text-pretty p-4">
                  <Latex>{question}</Latex>
                </div>
                {renderImage(Layout.RIGHT)}
              </div>

              {renderImage(Layout.BOTTOM)}
            </div>

            <div>
              <p className="text-2xl font-semibold text-gray-600">Solution</p>
              <p>
                Answer: <span className="font-bold">{answer}</span>
              </p>
              <p>{solution}</p>
            </div>

            <div className="mt-auto flex justify-center pb-4">
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-36 border border-black">
                  Close
                </Button>
              </DialogTrigger>
            </div>
          </div>{" "}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
