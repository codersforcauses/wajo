import { Router } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "@/components/ui/button";
import MobileNav from "@/components/ui/mobilenav";
import { LoginModal } from "@/components/ui/Users/login-modal";
import { useAuth } from "@/context/auth-provider";
import styles from "@/styles/modules/navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  return (
    <nav className="flex h-28 bg-[--nav-background]">
      <div className="container mx-auto flex items-center">
        <div className="flex-auto">
          <Image
            src="/wajo_white.svg"
            alt="WAJO logo with white background"
            width={105}
            height={105}
          />
        </div>
        <div className="flex flex-shrink items-center justify-between gap-20 text-xl font-medium max-md:hidden">
          <Link href="/news">News</Link>
          <Link href="/awards">Awards</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/contact">Contact us</Link>
          {isLoggedIn ? (
            <Button
              variant={"outline"}
              size={"lg"}
              className="font-roboto border-2 border-black text-lg"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <LoginModal>
              <Button
                variant={"outline"}
                size={"lg"}
                className="font-roboto border-2 border-black text-lg"
              >
                Login
              </Button>
            </LoginModal>
          )}
        </div>
        <div className="hidden max-md:flex">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
