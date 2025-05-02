"use client";

import CreateBarbershopForm from "./create-barbershop-form";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";

const RegisterBarbershops = () => {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Cadastrar Loja</DrawerTitle>
        <DrawerDescription className="font-medium text-foreground">
          Insira os dados da sua barbearia bem como os serviços prestados.
        </DrawerDescription>
      </DrawerHeader>

      <CreateBarbershopForm onSubmit={() => {}} />
    </>
  );
};

export default RegisterBarbershops;
