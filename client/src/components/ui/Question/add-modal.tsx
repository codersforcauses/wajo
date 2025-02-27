import "katex/dist/katex.min.css";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-auto w-[95%] max-w-[400px] flex-col items-center rounded-lg bg-white p-6 shadow-xl">
        <VisuallyHidden.Root>
          <DialogTitle>Question Added</DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden.Root>

        <div className="text-center text-gray-900">
          <p className="text-2xl font-semibold">Question Added</p>
          <p className="text-md mt-2 text-gray-500">
            You can view questions in detail on the Question Bank page.
          </p>
        </div>

        <div className="mt-6 flex gap-10">
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="w-36 border border-gray-400 bg-white"
            >
              Close
            </Button>
          </DialogTrigger>
          <Button
            variant="secondary"
            className="w-36 border border-gray-400 text-black"
          >
            Add Other Question
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
