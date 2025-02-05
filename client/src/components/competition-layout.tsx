import React from "react";

import Footer from "./ui/footer";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the application with a Navbar or Sidebar based on user authentication status.
 *
 * @param {LayoutProps} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 *
 */
export default function CompetitionLayout({ children }: LayoutProps) {
  return (
    <div>
      <div className="flex min-h-[90vh] flex-grow flex-col">{children}</div>
      <Footer isCompetition={true} />
    </div>
  );
}
