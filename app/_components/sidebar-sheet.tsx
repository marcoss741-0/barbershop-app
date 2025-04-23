"use client";

import { HomeIcon, CalendarDaysIcon, LogOutIcon } from "lucide-react";
import { ShortSearchOptions } from "../_constants/short-search";
import { Button } from "./ui/button";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ChoiceLogin from "./choice-login";
import { toast } from "sonner";
import { useTransition } from "react";
import { Progress } from "./ui/progress";

const SidebarSheet = () => {
  const [isPending, startTransition] = useTransition();

  const handleLoginWithGoogle = () => {
    try {
      startTransition(async () => {
        await signIn("google");
        toast.success("Login realizado!");
      });
    } catch (error) {
      toast.error("Erro ao fazer login com o Google.", {
        description: "Tente novamente mais tarde." + error,
      });
    }
  };

  const handleLogoutWithGoogle = async () => {
    await signOut();
  };

  const { data } = useSession();
  const { image, name, email } = data?.user || {};

  return (
    <>
      <SheetContent className="&[::-webkit-scrollbar]:hidden w-[90%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex w-full items-center justify-start gap-3 border-b border-solid py-5">
          {data?.user ? (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={image || ""} className="h-10 w-10" />
                <AvatarFallback>{name?.split(" ", 1) || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-[16px] font-bold">{name}</p>
                <p className="text-xs font-normal">{email}</p>
              </div>
            </>
          ) : (
            <>
              <ChoiceLogin
                action={handleLoginWithGoogle}
                isPending={isPending}
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-b border-solid py-5">
          <SheetClose asChild>
            <Button
              size="sm"
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
          <Button
            variant="ghost"
            size="sm"
            className="justify-start gap-2"
            asChild
          >
            <Link href={"/bookings"}>
              <CalendarDaysIcon />
              Agendamento
            </Link>
          </Button>
        </div>

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
