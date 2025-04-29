"use server";

import { redirect } from "next/navigation";
import Header from "../../_components/header";
import { queryUser } from "../../_data/query-on-db";
import { auth } from "../../_lib/auth-option";

const ManagerBarbershops = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  const userData = await queryUser(session.user.email);

  return (
    <>
      <Header />
    </>
  );
};

export default ManagerBarbershops;
