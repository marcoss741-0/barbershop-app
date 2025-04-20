import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import PhoneItem from "./phone-item";
import Image from "next/image";
import { Button } from "./ui/button";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isConfirmed = isFuture(booking.date);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Card className="min-w-[90%] space-y-3 rounded-md p-0">
            <CardContent className="flex justify-between">
              <div className="flex flex-col justify-start gap-2 p-4">
                <Badge variant={isConfirmed ? "default" : "secondary"}>
                  {isConfirmed ? "Confirmado" : "Finalizado"}
                </Badge>
                <h3 className="text-[16px] font-bold">
                  {booking.service.name}
                </h3>

                <div className="flex items-center justify-start gap-2">
                  <Avatar>
                    <AvatarImage src={booking.service.imageUrl} alt="Avatar" />
                    <AvatarFallback>
                      {booking.service.barbershop.name}
                    </AvatarFallback>
                  </Avatar>
                  <p>{booking.service.barbershop.name}</p>
                </div>
              </div>

              <div className="flex min-h-full flex-col items-center justify-center border-l-2 border-solid p-4">
                <p className="text-sm font-normal capitalize">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <h3 className="text-2xl font-bold">
                  {format(booking.date, "dd")}
                </h3>
                <p className="text-sm font-normal">
                  {format(booking.date, "HH:mm")}
                </p>
              </div>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent className="flex w-[90%] flex-col p-0">
          <SheetHeader className="border-b border-solid py-3">
            <SheetTitle className="p-2 text-left">
              Informações da reserva
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-3 p-5">
            <div className="relative flex h-[160px] w-full items-end">
              <Image
                src="/map.png"
                alt="Imagem do serviço"
                fill
                className="rounded-md object-cover"
              />
              <Card className="z-50 mx-5 mb-3 w-full p-0">
                <CardContent className="flex items-center gap-3 px-5 py-3">
                  <Avatar>
                    <AvatarImage
                      src={booking.service.barbershop.imageUrl}
                      alt={`Perfil da barbearia ${booking.service.barbershop.name}`}
                    />
                  </Avatar>
                  <div className="flex flex-col justify-start gap-1">
                    <h3 className="font-bold">
                      {booking.service.barbershop.name}
                    </h3>
                    <p className="text-xs">
                      {booking.service.barbershop.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Badge variant={isConfirmed ? "default" : "secondary"}>
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
            <Card>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">{booking.service.name}</h2>
                  <p className="text-sm font-bold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(booking.service.price))}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Data</h2>
                  <p className="text-sm capitalize">
                    {format(booking.date, "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Horário</h2>
                  <p className="text-sm">{format(booking.date, "HH:mm")}</p>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-400">Barbearia</h2>
                  <p className="text-sm">{booking.service.barbershop.name}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 p-5">
              <h2 className="text-sm font-normal text-gray-400">CONTATO</h2>
              {booking.service.barbershop.phones.map((phone) => (
                <PhoneItem phone={phone} />
              ))}
            </div>
          </div>
          <SheetFooter className="mt-auto p-5">
            <div className="flex w-full justify-between gap-2">
              <Button variant="outline" className="w-full">
                Voltar
              </Button>

              <Button variant="destructive" className="w-full">
                Cancelar reserva
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BookingItem;
