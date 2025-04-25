"use server";

import { signIn, signOut } from "../../_lib/auth-option";

export const initUser = async () => {
  await signIn("google");
};

export const offUser = async () => {
  await signOut();
};
