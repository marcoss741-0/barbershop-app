"use client";

import {
  HomeIcon,
  CalendarDaysIcon,
  LogOutIcon,
  Scissors,
  SquareArrowDownLeft,
  Store,
} from "lucide-react";
import { ShortSearchOptions } from "../_constants/short-search";
import { Button } from "./ui/button";
import { SheetClose, SheetContent } from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LoginForm } from "./login-form";

const SidebarSheet = () => {
  const handleLogoutWithGoogle = async () => {
    await signOut();
  };

  const { data } = useSession();
  const { image, name, email } = data?.user || {};

  return (
    <>
      <SheetContent className="&[::-webkit-scrollbar]:hidden w-full overflow-y-auto">
        {data?.user ? (
          <>
            <div className="flex items-center justify-start gap-2 border-b border-solid p-5 md:p-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={image || ""} className="h-10 w-10" />
                <AvatarFallback>{name?.split(" ", 1) || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-[16px] font-bold">{name}</p>
                <p className="text-xs font-normal">{email}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-6 md:p-10">
              <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                  href="#"
                  className="flex items-center gap-2 self-center font-medium"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Scissors className="size-4" />
                  </div>
                  ÔmegaBarber´s.
                </a>
                <LoginForm />
              </div>
              <SheetClose>
                <Button variant="secondary" className="gap-2">
                  <SquareArrowDownLeft size={18} />
                  Voltar
                </Button>
              </SheetClose>
            </div>
          </>
        )}

        {data?.user && (
          <div className="flex flex-col gap-2 border-b border-solid py-5">
            <SheetClose asChild>
              <Button
                size="lg"
                className="justify-start gap-2"
                variant="ghost"
                asChild
              >
                <Link href="/">
                  <HomeIcon />
                  Inicio
                </Link>
              </Button>
            </SheetClose>

            <Button variant="ghost" size="lg" className="justify-start gap-2">
              <Store />
              Minhas Barbearias
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="justify-start gap-2"
              asChild
            >
              <Link href={"/bookings"}>
                <CalendarDaysIcon />
                Agendamento
              </Link>
            </Button>
          </div>
        )}
        {/* {data?.user && (
          <>
            <div className="flex flex-col gap-2 border-b border-solid py-5">
              {ShortSearchOptions.map((option) => (
                <SheetClose key={option.title} asChild>
                  <Link
                    href={`/barbershops?service=${option.title}`}
                    className="w-full"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start gap-3 p-3"
                    >
                      <Image
                        src={option.iconUrl}
                        alt={option.title}
                        width={18}
                        height={18}
                      />
                      {option.title}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </>
        )} */}
        {data?.user && (
          <>
            <div className="flex w-full items-center justify-start gap-2 py-5">
              <Button
                size="default"
                variant="ghost"
                className="w-full justify-start gap-2 p-3"
                onClick={handleLogoutWithGoogle}
              >
                <LogOutIcon />
                <p className="text-sm">Sair da Conta</p>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </>
  );
};

export default SidebarSheet;
