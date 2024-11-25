import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "@/components/dashboard-sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/trpc/server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",

  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const data = await api.user.getPermissions({});

  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar
            permissions={
              data.map((i) => ({
                action: i?.actions,
                source: i?.source,
              })) ?? []
            }
          />
          <main className="flex-1 font-sans">{children}</main>
        </div>
      </SidebarProvider>
    </TRPCReactProvider>
  );
}
