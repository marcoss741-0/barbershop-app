"use client";

import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { isFuture } from "date-fns";
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
import BookingResume from "./booking-resume";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { barbershopService: true; barbershop: true };
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

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <div className="cursor-pointer">
            <BookingSummary booking={booking} />
          </div>
        </SheetTrigger>
        <SheetContent className="mx-auto flex max-h-screen w-[90%] flex-col overflow-y-auto rounded-t-lg p-4 sm:p-6 [&::-webkit-scrollbar]:hidden">
          <SheetHeader className="border-b border-solid py-3">
            <SheetTitle className="text-center text-lg font-semibold">
              Informações da reserva
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 p-3">
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
                      src={booking.barbershop.imageUrl}
                      alt={`Perfil da barbearia ${booking.barbershop.name}`}
                    />
                  </Avatar>
                  <div className="flex flex-col justify-start gap-1">
                    <h3 className="font-bold">{booking.barbershop.name}</h3>
                    <p className="text-xs">{booking.barbershop.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Badge variant={isConfirmed ? "default" : "secondary"}>
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>

            <BookingResume
              barbershop={booking.barbershop}
              service={booking.barbershopService}
              selectedDate={booking.date}
            />

            <div className="flex flex-col gap-3 p-5">
              <h2 className="text-sm font-medium text-foreground">CONTATO</h2>
              {booking.barbershop.phones.map((phone, index) => (
                <PhoneItem key={index} phone={phone} />
              ))}
            </div>
          </div>

          <SheetFooter className="mb-5 px-4">
            <div className="flex w-full flex-wrap justify-between gap-3">
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  className="w-full border border-foreground sm:w-auto"
                >
                  Voltar
                </Button>
              </SheetClose>
              {isConfirmed && (
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
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
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BookingItem;
