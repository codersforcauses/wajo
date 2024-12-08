// client/src/components/layouts/Navbar.tsx
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-white">MyApp</div>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
