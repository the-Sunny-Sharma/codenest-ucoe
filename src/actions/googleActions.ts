"use server";

import { signIn, signOut } from "@/auth";

const googleSignin = async () => {
  await signIn("google");
};

const userSignOut = async () => {
  await signOut();
};

export { googleSignin, userSignOut };
