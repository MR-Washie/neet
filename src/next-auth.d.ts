import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "ADMIN" | "USER";
      clearanceLevel?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "USER";
    clearanceLevel?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER";
    clearanceLevel?: string;
  }
}