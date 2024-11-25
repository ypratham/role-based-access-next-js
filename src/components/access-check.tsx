"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ReactNode } from "react";
import { BackgroundLines } from "./ui/background-lines";

interface AccessStatusCheckProps {
  children: ReactNode;
}

export default function AccessStatusCheckUser({
  children,
}: AccessStatusCheckProps) {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const { data, isLoading } = api.user.getAccountStatus.useQuery(
    {
      id: sessionData?.user.id + "",
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 1,
    },
  );

  useEffect(() => {
    if (!isLoading && data?.isActive === false) {
      signOut({
        redirectTo: "/",
      });

      console.log("NOT VALID USER");
    }
  }, [data, isLoading, router]);

  if (isLoading)
    return (
      <BackgroundLines className="min-w-screen flex min-h-screen flex-col items-center justify-center">
        <h2 className="animate-pulse text-4xl font-bold text-gray-500">
          Hold tight while we authenticate
        </h2>
      </BackgroundLines>
    );

  return <>{children}</>;
}
