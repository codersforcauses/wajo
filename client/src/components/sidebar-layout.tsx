import React from "react";

import AppSidebar from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Role } from "@/types/user";

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
}

export default function SidebarLayout({ children, role }: LayoutProps) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar Role={role} />
        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
