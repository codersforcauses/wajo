import Link from "next/link";
import { useRouter } from "next/router";
import { use } from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function PracticeQuizPage() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <PublicPage>
      <div className="mx-auto my-3 flex items-center justify-center gap-3 lg:max-w-lg">
        Quiz Practice not finished yet
        <Button onClick={handleGoBack}>Go back </Button>
      </div>
    </PublicPage>
  );
}
