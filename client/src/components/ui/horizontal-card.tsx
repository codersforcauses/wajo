import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HorizontalCard({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-12 w-2/3 items-center justify-between rounded-lg border border-black bg-[#FFE8A3] px-4"
    >
      <h5 className="text-lg">{title}</h5>
      <ArrowRight size={20} />
    </Link>
  );
}
