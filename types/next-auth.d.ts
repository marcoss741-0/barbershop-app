import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Adicione a propriedade `id`
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Adicione a propriedade `id`
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface JWT {
    id: string; // Adicione a propriedade `id` ao token JWT
  }
}
