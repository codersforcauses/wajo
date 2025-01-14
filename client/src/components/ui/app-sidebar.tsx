import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { navData } from "@/types/app-sidebar";
import { Role } from "@/types/user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  Role: Role;
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
export function AppSidebar({ Role, ...props }: AppSidebarProps) {
  const router = useRouter();
  const roleNavData = navData[Role];
  roleNavData.forEach((section) => {
    for (const item of section.items) {
      const regex = new RegExp(`^${item.url.replace(/\[.*?\]/g, ".*")}$`);
      item.isActive = regex.test(router.pathname);

      if (item.isActive && !section.isActive) {
        section.isActive = true;
      }
    }
  });

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0">
        {roleNavData.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarMenu>
              <Collapsible
                key={section.title}
                asChild
                defaultOpen // make it open if it's active
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
                        "data-[state=open]:hover:bg-black data-[state=open]:hover:text-white",
                      )}
                    >
                      {section.icon && <section.icon />}
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={item.isActive}
                            className="hover:bg-yellow data-[active=true]:bg-yellow"
                          >
                            <a href={item.url}>
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuSubButton>
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
      <SidebarFooter>
        <SidebarGroupLabel>Ctrl/Cmd + b to hide me</SidebarGroupLabel>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
