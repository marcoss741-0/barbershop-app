import {
  CalendarDaysIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  ScissorsIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { ShortSearchOptions } from "../_constants/short-search";

const Header = () => {
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-2">
            <ScissorsIcon className="h-8 w-8 font-bold text-purple-900" />
            <h1 className="text-2xl font-normal text-gray-100">
              ÔMEGA BARBER´S
            </h1>
          </div>
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size={"icon"}
                  variant="outline"
                  className="cursor-pointer"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 border-b border-solid py-5">
                  <Button size="sm" className="justify-start gap-2">
                    <HomeIcon />
                    Inicio
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start gap-2"
                  >
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
                        width={16}
                        height={16}
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
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Header;
