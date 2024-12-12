import Image from "next/image";
import Link from "next/link";
import React from "react";

import logo from "../../public/wajo_white.svg";
import styles from "../styles/modules/navbar.module.css";

const Navbar = () => {
  return (
    <nav className={`${styles.nav}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className={styles.logo}>
          <Image
            src={logo}
            alt="WAJO logo with white background"
            width={105}
            height={105}
          />
        </div>
        <div className={`${styles.navLinks}`}>
          <Link href="/news">News</Link>
          <Link href="/awards">Awards</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/contact">Contact us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
