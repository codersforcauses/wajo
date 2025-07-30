import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";

export default function SubmitSuccess() {
  const router = useRouter();
  return (
    <>
      <div>Team submission completed!</div>
      <Button onClick={() => router.push("/team")}>Back</Button>
    </>
  );
}
