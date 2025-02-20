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

export default function RetryModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleRetry = () => {};
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-auto w-[95%] max-w-[400px] flex-col items-center rounded-lg bg-white p-6 shadow-xl">
        <VisuallyHidden.Root>
          <DialogTitle>Question Added</DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden.Root>

        <div className="text-center font-semibold text-gray-900">
          <p className="text-md mt-2">Sorry. Something went wrong.</p>
          <p className="text-md mt-2">Please try again.</p>
        </div>

        <div className="mt-4 flex gap-10">
          <Button
            variant="secondary"
            className="w-36 border border-gray-400 text-black"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
