"use server";

import db from "../_lib/prisma";
import { CreateBarbershopForm } from "./create-barbershop-form";
import { SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

const RegisterBarbershops = async () => {
  const standardServices = await db.service.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <>
      <SheetHeader className="p-3">
        <SheetTitle>Cadastrar Loja</SheetTitle>
        <SheetDescription className="font-medium text-foreground">
          Insira os dados da sua barbearia bem como os serviços prestados.
        </SheetDescription>
      </SheetHeader>
      <CreateBarbershopForm standardServices={standardServices} />
    </>
  );
};

export default RegisterBarbershops;
