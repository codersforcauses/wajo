import { useRouter } from "next/router";
import React from "react";

import AppSidebar from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Role } from "@/types/user";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
}

/**
 * Sidebar layout component that renders a sidebar with breadcrumb navigation.
 * Displays different content based on the user's role.
 *
 * @param {LayoutProps} props - The component props.
 * @param {React.ReactNode} props.children - The content to render inside the sidebar layout.
 * @param {Role} props.role - The role of the user, used to control sidebar behavior.
 */
export default function Sidebar({ children, role }: LayoutProps) {
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    // handle dynamic segments
    const isDynamic = /^\[.*\]$/.test(segment);
    const actualSegment = isDynamic
      ? router.query[segment.slice(1, -1)] || segment.slice(1, -1)
      : segment;

    const title = actualSegment
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    const url =
      "/" +
      pathSegments
        .slice(0, index + 1)
        .map((seg) => {
          const isParam = /^\[.*\]$/.test(seg);
          return isParam ? router.query[seg.slice(1, -1)] || seg : seg;
        })
        .join("/");

    return { title, url };
  });

  return (
    <div>
      <SidebarProvider>
        <AppSidebar className="z-50" Role={role} />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-5" />
            <Breadcrumb className="ml-4">
              <BreadcrumbList className="text-xl">
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.url}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.url}>
                        {item.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="[&>svg]:h-5 [&>svg]:w-5" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
