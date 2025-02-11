import "katex/dist/katex.min.css";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDynamicDeleteMutation } from "@/hooks/use-delete-data";
import { DeleteModalProps } from "@/types/question";

import { Button } from "../button";

export default function DeleteModal({ children, data }: DeleteModalProps) {
  const router = useRouter();

  const { mutate: deleteQuestion, isPending } = useDynamicDeleteMutation({
    baseUrl: "/questions/question-bank",
    mutationKey: ["question_delete"],
    onSuccess: () => {
      router.reload();
      toast.success("School has been deleted.");
    },
  });
  const handleDelete = () => {
    deleteQuestion(data.id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-auto w-[95%] max-w-[400px] flex-col items-center rounded-lg bg-[--nav-background] p-6 shadow-xl">
        <VisuallyHidden.Root>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden.Root>

        <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />

        <div className="text-center text-gray-900">
          <p className="text-2xl font-semibold">
            Are you sure you want to permanently delete this question?
          </p>
          <p className="text-md mt-1 text-gray-500">
            Once deleted, it cannot be recovered.
          </p>
        </div>

        <div className="mt-6 flex gap-10">
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-36 border border-black bg-white"
            >
              No
            </Button>
          </DialogTrigger>
          <Button onClick={handleDelete} variant={"secondary"} className="w-36">
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
