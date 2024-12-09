import React from "react";

import Navbar from "./layouts/navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
