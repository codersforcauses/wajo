import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

import logo from "../../public/wajo_white.svg";
import styles from "../styles/modules/navbar.module.css";
import MobileNav from "./ui/mobilenav";

const Navbar = () => {
  return (
    <nav className={`${styles.nav}`}>
      <div className="container mx-auto flex items-center">
        <div className={`${styles.logo} flex-auto`}>
          <Image
            src={logo}
            alt="WAJO logo with white background"
            width={105}
            height={105}
          />
        </div>
        <div
          className={`${styles.navLinks} flex flex-shrink justify-between max-md:hidden`}
        >
          <Link href="/news">News</Link>
          <Link href="/awards">Awards</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/contact">Contact us</Link>
        </div>
        <div className="ml-24 flex-initial">
          <Button
            variant={"outline"}
            className={`${styles.loginButton} font-roboto`}
          >
            Login
          </Button>
        </div>
        <MobileNav></MobileNav>
      </div>
    </nav>
  );
};

export default Navbar;
