import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * WaitingLoader component displays a loading spinner inside a disabled button, indicating that content is being loaded.
 *
 * **Usage:**
 * Simply include where you need to display a loading state within the UI.
 *
 * @example
 * if (isLoading) return <WaitingLoader />;
 */
export function WaitingLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center pt-20", className)}>
      <Button className="bg-transparent text-2xl" disabled>
        <Loader className="mr-2 animate-spin" /> Loading...
      </Button>
    </div>
  );
}
