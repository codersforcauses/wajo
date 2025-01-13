import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import MobileNav from "@/components/ui/mobilenav";
import LoginModal from "@/components/ui/user/login-modal";

import logo from "../../public/wajo_white.svg";
import styles from "../styles/modules/navbar.module.css";

export default function Navbar() {
  return (
    <nav className="flex h-28 bg-[--nav-background]">
      <div className="container mx-auto flex items-center">
        <div className="flex-auto">
          <Image
            src={logo}
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
          <LoginModal>
            <Button
              variant={"outline"}
              size={"lg"}
              className="font-roboto border-2 border-black text-lg"
            >
              Login
            </Button>
          </LoginModal>
        </div>
        <div className="hidden max-md:flex">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
