import { ArrowLeft, ChevronRight, Command, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";
import { navData, updateSidebarMenu } from "@/types/app-sidebar";
import { Role } from "@/types/user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  Role: Role | null;
}

/**
 * Sidebar component for the application, rendering different navigation links based on user role.
 *
 * This component uses the Shadcn UI library to render a sidebar with collapsible menu items and role-specific navigation options.
 * It is designed to be dynamic, displaying different navigation data based on the user's role (e.g., Admin, Staff, Student).
 *
 * The sidebar utilizes Shadcn's `Sidebar`, `Collapsible`, and other components for smooth transitions and collapsible menu items.
 *
 * For more information on the Shadcn UI Sidebar and Collapsible components:
 * - [Sidebar Documentation](https://ui.shadcn.com/docs/components/sidebar)
 * - [Collapsible Documentation](https://ui.shadcn.com/docs/components/collapsible)
 *
 * **Example Implementation:**
 * - [Sidebar Block Example](https://ui.shadcn.com/blocks/sidebar)
 *
 * @param {AppSidebarProps} props - The properties for the sidebar component.
 * @param {Role} props.Role - The role of the user (e.g., Admin, Staff, Student), used to determine the navigation items to display.
 */
export default function AppSidebar({ Role, ...props }: AppSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  // Memoize role-based navigation data to avoid recalculating on every render.
  const roleNavData = useMemo(() => {
    if (!Role) return [];
    return updateSidebarMenu(navData[Role], router.pathname);
  }, [Role, router.pathname]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      return roleNavData.reduce(
        (acc, section) => {
          acc[section.title] = section.isActive || false;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    },
  );

  const handleMenuToggle = (sectionTitle: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleLogout = () => {
    router.push("/").then(() => logout());
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <Sidebar {...props}>
      <div className="flex h-full flex-col justify-between">
        <ScrollArea className="pe-1">
          <SidebarContent className="no-scrollbar gap-0 overflow-y-scroll">
            <div className="flex items-center justify-center pt-2">
              <Link href="/dashboard">
                <Image
                  src="/wajo_white.svg"
                  alt="logo with white background"
                  width={100}
                  height={100}
                  className="cursor-pointer"
                  priority
                />
              </Link>
            </div>
            {roleNavData.map((section) => (
              <SidebarGroup key={section.title} className="p-1.5 pb-0">
                <SidebarMenu>
                  <Collapsible
                    asChild
                    key={section.title}
                    title={section.title}
                    open={openSections[section.title]}
                    onOpenChange={() => handleMenuToggle(section.title)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          tooltip={section.title}
                          isActive={section.isActive}
                          className={cn(
                            "data-[active=true]:bg-black data-[active=true]:text-white",
                            "data-[active=true]:hover:bg-black data-[active=true]:hover:text-white",
                            "data-[state=open]:bg-black data-[state=open]:text-white",
                            "data-[state=open]:hover:bg-black data-[state=open]:hover:text-white",
                          )}
                        >
                          {section.icon && <section.icon />}
                          <span>{section.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l-2">
                          {section.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={item.isActive}
                                className="hover:bg-yellow data-[active=true]:bg-yellow"
                              >
                                <Link
                                  href={item.url}
                                  target={item.isNewTab ? "_blank" : "_self"}
                                  rel={
                                    item.isNewTab ? "noopener noreferrer" : ""
                                  } // add security for _blank only
                                >
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                              {item.items && item.items.length > 0 && (
                                <SidebarMenuSub className="border-l-2">
                                  {item.items.map((subitem) => (
                                    <SidebarMenuSubItem key={subitem.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={subitem.isActive}
                                        className="hover:bg-yellow data-[active=true]:bg-yellow"
                                      >
                                        <Link
                                          href={subitem.url}
                                          target={
                                            subitem.isNewTab
                                              ? "_blank"
                                              : "_self"
                                          }
                                          rel={
                                            subitem.isNewTab
                                              ? "noopener noreferrer"
                                              : ""
                                          } // add security for _blank only
                                        >
                                          <span>{subitem.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </ScrollArea>

        <SidebarFooter className="gap-0">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleBack} aria-label="Back">
                <ArrowLeft /> Public Page
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} aria-label="Logout">
                <LogOut /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupLabel>
            Ctrl /
            <span className="mx-1 font-bold">
              <Command size={12} />
            </span>{" "}
            + b to hide me
          </SidebarGroupLabel>
        </SidebarFooter>
        {/* <SidebarRail /> */}
      </div>
    </Sidebar>
  );
}
