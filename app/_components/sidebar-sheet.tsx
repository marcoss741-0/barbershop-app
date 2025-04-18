import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/_components/ui/avatar";
import { HomeIcon, CalendarDaysIcon, LogOutIcon } from "lucide-react";
import { ShortSearchOptions } from "../_constants/short-search";
import { Button } from "./ui/button";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";

const SidebarSheet = () => {
  return (
    <>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex items-center gap-3 border-b border-solid py-5">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://github.com/marcoss741-0.png"
              className="h-10 w-10"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-[16px] font-bold">Marcos Martins</p>
            <p className="text-xs font-normal">marcossan741@icloud.com</p>
          </div>
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
