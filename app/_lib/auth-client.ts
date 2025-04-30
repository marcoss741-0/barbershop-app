"use client";

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

export const signIn = async (provider: string, options?: any) => {
  return await nextAuthSignIn(provider, options);
};

export const signOut = async (options?: any) => {
  return await nextAuthSignOut(options);
};
