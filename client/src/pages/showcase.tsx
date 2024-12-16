import { useState } from "react";

import { MathInput } from "@/components/ui/inputs";

export default function Home() {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col content-center gap-4 px-10">
      <div>
        <h1>Admin</h1>
        <div className="flex flex-col gap-2">
          <MathInput input={input} onChange={(e) => setInput(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
