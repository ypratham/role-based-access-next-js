import Navbar from "@/components/navbar";
import { Container } from "@/components/ui/container";
import { Lock, Shield, UserCog } from "lucide-react";

export default async function Home() {
  return (
    <div>
      <Navbar />{" "}
      <Container>
        <section className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="mb-6 w-1/2 text-4xl font-bold tracking-[.3rem] text-gray-800 md:text-6xl">
            Where Security Meets Simplicity
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
            Secure, scalable access management built with Next.js and T3 Stack
          </p>
        </section>

        <section className="flex flex-col gap-6 pb-20">
          <h2 className="text-center text-3xl font-bold">Features</h2>
          <div className="container mb-3 grid gap-8 px-4 text-center md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <Lock className="mx-auto mb-4 text-blue-500" size={56} />
              <h2 className="mb-4 text-xl font-semibold">
                Granular Permissions
              </h2>
              <p className="text-gray-600">
                Fine-tuned access control at user and role levels
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <UserCog className="mx-auto mb-4 text-green-500" size={56} />
              <h2 className="mb-4 text-xl font-semibold">User Management</h2>
              <p className="text-gray-600">
                Manage users, roles, and permissions seamlessly
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg">
              <Shield className="mx-auto mb-4 text-purple-500" size={56} />
              <h2 className="mb-4 text-xl font-semibold">
                Secure Architecture
              </h2>
              <p className="text-gray-600">
                Enterprise-grade security with T3 Stack
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
