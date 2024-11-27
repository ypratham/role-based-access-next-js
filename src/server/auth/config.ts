import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { db } from "@/server/db";
import Google from "next-auth/providers/google";
import { env } from "@/env";
import { api } from "@/trpc/server";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roleId: bigint | null;
      isActive: boolean | null;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    roleId?: string;
    isActive?: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  pages: {
    error: "/error",
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    signIn({ user }) {
      if (user.isActive == false) return false;

      return true;
    },
    session: async ({ session, user }) => {
      const payload = {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          roleId: user.roleId,
          isActive: user.isActive,
        },
      };

      return payload;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.isActive = user.isActive;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
