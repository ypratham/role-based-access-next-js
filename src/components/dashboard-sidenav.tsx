"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { NavUser } from "./ui/nav-user";
import Image from "next/image";
import { usePermission } from "@/hooks/user-permission";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  "use client";

  const pathname = usePathname();

  const userReadPermission = usePermission("USER", "READ");
  const rolesReadPermission = usePermission("ROLES", "READ");
  const logsReadPermission = usePermission("LOGS", "READ");
  const permissionReadPermission = usePermission("PERMISSIONS", "READ");

  const rolesWritePermission = usePermission("ROLES", "READ");

  const permissionWritePermission = usePermission("PERMISSIONS", "READ");

  if (
    userReadPermission.isLoading ||
    rolesReadPermission.isLoading ||
    logsReadPermission.isLoading ||
    permissionReadPermission.isLoading ||
    rolesWritePermission.isLoading ||
    permissionWritePermission.isLoading
  ) {
    return <Skeleton className="m-4 w-64 flex-grow-0 rounded-xl" />;
  }

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "User",
        url: "#",
        items: [
          {
            title: "Manage",
            url: "/dashboard",
            access: true,
          },
        ],
        access: userReadPermission.hasPermission,
      },
      {
        title: "Roles",
        url: "#",
        items: [
          {
            title: "Manage",
            url: "/dashboard/roles",
            access: true,
          },
          {
            title: "Create new ",
            url: "/dashboard/roles/new",
            access: rolesWritePermission.hasPermission,
          },
        ],
        access: rolesReadPermission.hasPermission,
      },
      {
        title: "Permissions",
        url: "#",
        items: [
          {
            title: "Manage",
            url: "/dashboard/permission",
            access: true,
          },
          {
            title: "Create new ",
            url: "/dashboard/permission/new",
            access: permissionWritePermission.hasPermission,
          },
        ],
        access: permissionReadPermission.hasPermission,
      },
      {
        title: "Logs",
        url: "#",
        items: [
          {
            title: "Manage",
            url: "/dashboard/logs",
            access: true,
          },
        ],
        access: logsReadPermission.hasPermission,
      },
    ],
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="flex flex-row items-center gap-3 p-3">
        <Image
          src={"/logo.png"}
          alt=""
          width={100}
          height={100}
          quality={100}
          className="h-8 w-8"
        />
        <p className="text-2xl font-bold">DeployIt</p>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => {
          if (!item.access) return;

          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => {
                    if (!item.access) return;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname == item.url}
                        >
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
