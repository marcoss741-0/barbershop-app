"use client";

import CreateBarbershopForm from "./create-barbershop-form";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

const RegisterBarbershops = () => {
  return (
    <>
      <SheetHeader className="p-3">
        <SheetTitle>Cadastrar Loja</SheetTitle>
        <SheetDescription className="font-medium text-foreground">
          Insira os dados da sua barbearia bem como os serviços prestados.
        </SheetDescription>
      </SheetHeader>
      <CreateBarbershopForm onSubmit={() => {}} />
    </>
  );
};

export default RegisterBarbershops;
