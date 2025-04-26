import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { compareSync } from "bcrypt-ts";

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
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            throw new Error("Email e senha são obrigatórios.");
          }

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new Error("Usuario não encontrado");
          }

          const passwordMatch = compareSync(password, user.password);
          if (!passwordMatch) {
            throw new Error("Senha invalida!");
          }

          return {
            id: user.id,
            image: user.image,
            name: user.name,
            mail: user.email,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error.message);
          throw new Error(error.message || "Erro interno no servidor.");
        }
      },
    }),
  ],
});
