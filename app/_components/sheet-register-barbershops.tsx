"use server";

import { CreateBasicBarbershopForm } from "./create-basic-barbershop-form";
import { SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

const RegisterBarbershops = async () => {
  return (
    <>
      <SheetHeader className="p-3">
        <SheetTitle>Cadastrar Loja</SheetTitle>
        <SheetDescription className="font-medium text-foreground">
          Insira os dados da sua barbearia bem como os serviços prestados.
        </SheetDescription>
      </SheetHeader>
      <CreateBasicBarbershopForm />
    </>
  );
};

export default RegisterBarbershops;
