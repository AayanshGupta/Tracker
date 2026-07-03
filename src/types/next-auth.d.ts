import type { Permission, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
    teamId?: string | null;
    permissions?: Permission[];
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      teamId?: string | null;
      permissions?: Permission[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    teamId?: string | null;
    permissions?: Permission[];
  }
}
