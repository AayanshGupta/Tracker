import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Permission, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  // Required for deployments behind proxies/load balancers (Vercel, Railway, etc.)
  trustHost: true,
  session: {
    strategy: "jwt",
    // Sessions expire after 8 hours — appropriate for an internal business tool
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Office email",
      credentials: {
        email: { label: "Office Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: { permissions: true, team: true }
        });

        if (!user?.passwordHash || !user.active) return null;

        const passwordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          teamId: user.teamId,
          permissions: user.permissions.map((grant) => grant.permission)
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.teamId = user.teamId ?? null;
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as Role;
        session.user.teamId = typeof token.teamId === "string" ? token.teamId : null;
        session.user.permissions = Array.isArray(token.permissions) ? (token.permissions as Permission[]) : [];
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig);
