// src/types/next-auth.d.ts
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      workshopId: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    workshopId: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    workshopId: string;
    role: UserRole;
  }
}
