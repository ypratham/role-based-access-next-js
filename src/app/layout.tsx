import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth";

export const metadata: Metadata = {
  title: "AccessNexus",
  description: "Where Security Meets Simplicity",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const openSans = Open_Sans({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html>
      <body className={openSans.className}>
        <TRPCReactProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </TRPCReactProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
