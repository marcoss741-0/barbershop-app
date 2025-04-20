"use client";

import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import PhoneItem from "./phone-item";
import Image from "next/image";
import { Button } from "./ui/button";
import BookingSummary from "./booking-summary";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { toast } from "sonner";
import { deleteBooking } from "../_actions/delete-booking";
import { useState } from "react";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isConfirmed = isFuture(booking.date);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleDeleteBooking = async () => {
    try {
      deleteBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");

      setTimeout(() => {
        setDrawerOpen(false);
        setSheetOpen(false);
      }, 1500);
    } catch (error) {
      toast.error("Error deleting booking: " + error);
    }
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    setSheetOpen(isOpen);
  };

  const {
    service: { barbershop },
  } = booking;

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <div className="cursor-pointer">
            <BookingSummary booking={booking} />
          </div>
        </SheetTrigger>
        <SheetContent className="flex h-[99vh] w-[90%] max-w-md flex-col overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden">
          <SheetHeader className="border-b border-solid py-3">
            <SheetTitle className="p-2 text-left">
              Informações da reserva
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-5 p-3">
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
                      src={barbershop.imageUrl}
                      alt={`Perfil da barbearia ${barbershop.name}`}
                    />
                  </Avatar>
                  <div className="flex flex-col justify-start gap-1">
                    <h3 className="font-bold">{barbershop.name}</h3>
                    <p className="text-xs">{barbershop.address}</p>
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
                  <p className="text-sm">{barbershop.name}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 p-5">
              <h2 className="text-sm font-normal text-gray-400">CONTATO</h2>
              {barbershop.phones.map((phone, index) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>
          </div>
          <SheetFooter className="mt-auto p-5">
            <div className="flex w-full justify-between gap-2">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Voltar
                </Button>
              </SheetClose>
              {isConfirmed && (
                <>
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Cancelar reserva
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Você tem certeza absoluta?</DrawerTitle>
                        <DrawerDescription>
                          Esta ação não pode ser desfeita.
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteBooking}
                        >
                          Continuar
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Voltar</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BookingItem;
