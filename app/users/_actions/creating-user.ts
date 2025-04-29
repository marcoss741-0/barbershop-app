"use server";

import { hashSync } from "bcrypt-ts";
import db from "../../_lib/prisma";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  imageUrl: string,
) => {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("Email já está em uso!");
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashSync(password),
        image: imageUrl,
      },
    });

    return newUser;
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.message);
    throw new Error(error.message || "Erro ao criar usuário.");
  }
};
