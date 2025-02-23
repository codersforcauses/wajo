import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDynamicDeleteMutation } from "@/hooks/use-delete-data";
import { DeleteModalProps } from "@/types/question";

export default function DeleteModal({
  baseUrl,
  id,
  entity = "data",
  children,
}: DeleteModalProps) {
  const router = useRouter();

  const { mutate: deleteData, isPending } = useDynamicDeleteMutation({
    baseUrl: baseUrl,
    mutationKey: [`${entity}.delete`],
    onSuccess: () => {
      toast.success(`The ${entity} has been deleted.`);
      router.reload();
    },
  });

  const onDelete = () => {
    deleteData(id);
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
            Are you sure you want to permanently delete this {entity}?
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
          <Button onClick={onDelete} variant={"secondary"} className="w-36">
            {isPending ? "Deleting..." : "Yes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
