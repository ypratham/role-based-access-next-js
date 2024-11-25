"use client";

import { useSession, SessionProvider } from "next-auth/react";

const Test = () => {
  const session = useSession();
  return <p>Welcome {session?.status}</p>;
};

export const ClientComponent = () => {
  return (
    <SessionProvider>
      <Test />
    </SessionProvider>
  );
};
