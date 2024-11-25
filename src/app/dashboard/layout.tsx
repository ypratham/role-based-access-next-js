import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { AppSidebar } from "@/components/dashboard-sidenav";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",

  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar />
          <main className="flex-1 font-sans">{children}</main>
        </div>
      </SidebarProvider>
    </TRPCReactProvider>
  );
}
