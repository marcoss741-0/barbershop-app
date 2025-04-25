"use server";

import { hashSync } from "bcrypt-ts";
import db from "../_lib/prisma";

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserParams) => {
  await db.user.create({
    data: {
      name,
      email,
      password: hashSync(password),
    },
  });
};
