import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex items-center justify-between gap-10 bg-[--nav-background] px-10 py-12 text-center max-md:flex-col">
      <h5>Western Australian Junior mathematics Olympiad</h5>
      <div className="flex flex-shrink items-center justify-between gap-20 text-xl font-medium">
        <Link href="/news" className="hover:animate-bounce">
          News
        </Link>
        <Link href="/awards" className="hover:animate-bounce">
          Awards
        </Link>
        <Link href="/resources" className="hover:animate-bounce">
          Resources
        </Link>
        <Link href="/contact" className="hover:animate-bounce">
          Contact us
        </Link>
      </div>
    </div>
  );
}
