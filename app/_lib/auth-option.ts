// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { AuthOptions } from "next-auth";
// import { Adapter } from "next-auth/adapters";
// import db from "./prisma";
// import GoogleProvider from "next-auth/providers/google";
// import { compareSync } from "bcrypt-ts";
// import Credentials from "next-auth/providers/credentials";

// export const authOptions: AuthOptions = {
//   adapter: PrismaAdapter(db) as Adapter,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     Credentials({
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         const user = await db.user.findUnique({
//           where: {
//             email,
//           },
//         });

//         if (!user) {
//           throw new Error("Usuário não encontrado.");
//         }

//         const isPasswordValid = compareSync(password, user.password as string);
//         if (!isPasswordValid) {
//           throw new Error("Senha inválida.");
//         }

//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id ?? "";
//         token.name = user.name ?? "";
//         token.email = user.email ?? "";
//         token.image = user.image ?? "";
//       }
//       return token;
//     },
//   },

//   secret: process.env.NEXT_AUTH_SECRET,
// };

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import db from "./prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Credentials({});
  ],
});
