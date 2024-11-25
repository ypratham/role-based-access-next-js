"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { Button } from "./ui/button";
import { Container } from "./ui/container";

export default function Navbar() {
  const { status } = useSession();
  return (
    <nav className="static left-0 top-0 border-b bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href={"/"} className="flex items-center gap-2 text-2xl font-bold">
          <Image
            src={"/logo.png"}
            alt=""
            width={300}
            height={300}
            quality={100}
            className="h-10 w-10"
          />
          AccessNexus
        </Link>
        <ul className="flex items-center gap-4">
          <li>
            <Link className="font-medium hover:underline" href={"/"}>
              Home
            </Link>
          </li>
          <li>
            <Link className="font-medium hover:underline" href={"/privacy"}>
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link className="font-medium hover:underline" href={"/tac"}>
              Terms & Condition
            </Link>
          </li>
          <li>
            {status === "authenticated" ? (
              <UserMenu />
            ) : (
              <Button
                onClick={async () => {
                  await signIn("google");
                }}
              >
                Continue with Google
              </Button>
            )}
          </li>
        </ul>
      </Container>
    </nav>
  );
}
