import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { compareSync } from "bcrypt-ts";
import { findUserByCredentials } from "../users/_actions/find-user-by-credentials";
import { string } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Email ou senha são obrigatórios.");
        }

        // Passando um objeto com mail e password
        const user = await findUserByCredentials({ mail: email, password });

        return user;
      },
    }),
  ],
});
