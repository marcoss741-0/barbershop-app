import {
  HomeIcon,
  CalendarDaysIcon,
  LogOutIcon,
  LogInIcon,
} from "lucide-react";
import { ShortSearchOptions } from "../_constants/short-search";
import { Button } from "./ui/button";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const SidebarSheet = () => {
  return (
    <>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
          <h2 className="text-[16px] font-bold">Olá, Faça seu login!</h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" className="cursor-pointer">
                <LogInIcon size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] rounded-xl">
              <DialogHeader>
                <DialogTitle>Faça login na plataforma</DialogTitle>
                <DialogDescription>
                  Conecte-se usando sua conta do Google.
                </DialogDescription>
              </DialogHeader>
              <Button
                className="items-center gap-2 text-[14px] font-bold"
                variant="outline"
              >
                <Image
                  src={"/google.svg"}
                  alt={"Login com o Google"}
                  width={16}
                  height={16}
                />
                Google
              </Button>
            </DialogContent>
          </Dialog>

          {/* <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://github.com/marcoss741-0.png"
              className="h-10 w-10"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-[16px] font-bold">Marcos Martins</p>
            <p className="text-xs font-normal">marcossan741@icloud.com</p>
          </div> */}
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
          <Button variant="ghost" size="sm" className="justify-start gap-2">
            <CalendarDaysIcon />
            Agendamento
          </Button>
        </div>

        <div className="flex flex-col gap-2 border-b border-solid py-5">
          {ShortSearchOptions.map((option) => (
            <Button
              size="sm"
              variant="ghost"
              className="justify-start gap-3 p-3"
            >
              <Image
                src={option.iconUrl}
                alt={option.title}
                width={18}
                height={18}
              />
              {option.title}
            </Button>
          ))}
        </div>
        <div className="flex w-full items-center justify-start gap-2 py-5">
          <Button
            size="default"
            variant="destructive"
            className="w-full justify-start gap-3 p-3"
          >
            <LogOutIcon />
            <p className="text-sm">Sair da Conta</p>
          </Button>
        </div>
      </SheetContent>
    </>
  );
};

export default SidebarSheet;
