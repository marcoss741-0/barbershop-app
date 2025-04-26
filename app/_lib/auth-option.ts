import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { compareSync } from "bcrypt-ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Tentativa de login com credenciais:", credentials?.email);

        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            console.log("Email ou senha não fornecidos");
            return null;
          }

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.log("Usuário não encontrado para o email:", email);
            return null;
          }

          const passwordMatch = compareSync(password, user.password);
          if (!passwordMatch) {
            console.log("Senha incorreta para o usuário:", email);
            return null;
          }

          console.log("Login bem-sucedido para o usuário:", email);
          return {
            id: user.id,
            image: user.image,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Erro detalhado ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
});
