// wajo logo
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function WajoLogo({
  className = "w-16",
}: {
  className?: string;
}) {
  return (
    <Image
      className={cn(className)}
      src="/wajo_white.svg"
      alt="WAJO logo with white background"
      width={0}
      height={0}
      priority={true}
    />
  );
}
