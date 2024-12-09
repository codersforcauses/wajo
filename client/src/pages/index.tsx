import { Roboto, Urbanist } from "next/font/google";
import { useState } from "react";

import { usePings } from "@/hooks/pings";
import { cn } from "@/lib/utils";

import { Button } from "../components/ui/button";

const fontRoboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const { data, isLoading } = usePings({
    enabled: clicked,
  });

  return (
    <main
      className={cn(
        "font-urbanist flex min-h-screen flex-col items-center gap-4 p-24",
        fontRoboto.variable,
        fontUrbanist.variable,
      )}
    >
      <h1 className="font-roboto text-3xl text-primary">Test title</h1>
      <Button onClick={() => setClicked(true)}>
        {isLoading ? "Loading" : "Ping"}
      </Button>
      <p>
        Response from server: <span>{data as string}</span>
      </p>
    </main>
  );
}
