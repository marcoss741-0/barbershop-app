import { compareSync } from "bcrypt-ts";
import db from "../../_lib/prisma";

interface CredentialsProps {
  mail: string;
  password: string;
}

export async function findUserByCredentials({
  mail,
  password,
}: CredentialsProps) {
  const user = await db.user.findUnique({
    where: {
      email: mail,
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
}
