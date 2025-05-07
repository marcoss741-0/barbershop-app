"use client";

import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import Image from "next/image";

const BookingOnLogin = () => {
  return (
    <>
      <CardContent className="items-center justify-center text-foreground">
        <h1 className="text-center">
          Faça login, para verificar seus agendametos!
        </h1>
        <div className="flex w-full items-center justify-between gap-4 p-2">
          <Button variant="secondary" className="w-full gap-2 border p-2">
            <Image src="google.svg" width={18} height={18} alt="Login Button" />
            Fazer Login
          </Button>
          <Button variant="secondary" className="w-full gap-2 border p-2">
            <Image src="cred2.svg" width={24} height={24} alt="Login Button" />
            Email & Senha
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default BookingOnLogin;
