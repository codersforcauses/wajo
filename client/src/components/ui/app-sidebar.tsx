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
import { navData } from "@/types/app-sidebar";
import { Role } from "@/types/user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  Role: Role;
}

export function AppSidebar({ Role, ...props }: AppSidebarProps) {
  const router = useRouter();
  const roleNavData = navData[Role];

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0">
        {roleNavData.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarMenu>
              <Collapsible
                key={section.title}
                asChild
                defaultOpen // Make it open if it's active
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton size="lg" tooltip={section.title}>
                      {section.icon && <section.icon />}
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => {
                        const isActive = new RegExp(
                          item.url.replace(/\[.*?\]/g, ".*"),
                        ).test(router.pathname);
                        return (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className="data-[active=true]:bg-background"
                            >
                              <a href={item.url}>
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
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
