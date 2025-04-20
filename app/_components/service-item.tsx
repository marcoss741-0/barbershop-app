"use client";

import { Barbershop, BarbershopService, Booking } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { formatCurrencyBRL } from "../helpers/formart-currency";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { format, set } from "date-fns";
import { Pick } from "@prisma/client/runtime/library";
import { toast } from "sonner";
import creatingBooking from "../_actions/creating-booking";
import { useSession } from "next-auth/react";
import { getBookings } from "../_actions/get-bookings";
import { Dialog, DialogContent } from "./ui/dialog";
import SigninDialog from "./signin-dialog";

interface BarbershopServicesProps {
  service: BarbershopService;
  barbershop?: Pick<Barbershop, "name">;
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const ServiceItem = ({ service, barbershop }: BarbershopServicesProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [bookingSheetIsopen, setBookingSheetIsopen] = useState(false);
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false);

  const { data } = useSession();

  const getTimeList = (bookings: Booking[]) => {
    const now = new Date(); // Data e hora atual

    return TIME_LIST.filter((time) => {
      const [hour, minute] = time.split(":").map(Number);
      const currentTime = new Date(selectedDay || now); // Use o dia selecionado ou o dia atual
      currentTime.setHours(hour, minute, 0, 0);

      // Verifica se o horário já passou
      if (currentTime < now) {
        return false;
      }

      // Verifica se o horário já está reservado
      const hasBookingInCurrentTime = bookings.some(
        (booking) =>
          booking.date.getHours() === hour &&
          booking.date.getMinutes() === minute,
      );
      return !hasBookingInCurrentTime;
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDay) return;
      await getBookings({
        date: selectedDay,
        serviceId: service.id,
      }).then((res) => {
        setDayBookings(res);
      });
    };
    fetchBookings();
  }, [selectedDay, service.id]);

  const handleBookingSheetIsopenChange = () => {
    setSelectedDay(undefined);
    setSelectedTime(undefined);
    setDayBookings([]);
    setBookingSheetIsopen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleCreatingBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return;

      const hour = Number(selectedTime?.split(":")[0]);
      const minute = Number(selectedTime?.split(":")[1]);
      const newDate = set(selectedDay, {
        hours: hour,
        minutes: minute,
      });

      await creatingBooking({
        date: newDate,
        serviceId: service.id,
        // userId: (data?.user as any).id,
      });

      toast.success("Agendamento realizado!!");

      handleBookingSheetIsopenChange();
    } catch (error) {
      console.log(error);
      toast.error("Não foi possivel criar seu agendamento!");
    }
  };

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsopen(true);
    }

    return (
      toast.warning("Voce precisa estar logado para agendar um horario", {
        duration: 3000,
        style: {
          backgroundColor: "#fff",
          color: "#000",
        },
      }),
      setSignInDialogIsOpen(true)
    );
  };

  return (
    <>
      <Card className="w-full py-1">
        <CardContent className="flex w-full items-center justify-between gap-3 px-2">
          <div className="relative max-h-28 min-h-28 min-w-28 max-w-28">
            <Image
              className="rounded-lg object-cover"
              alt={service.name}
              src={service.imageUrl}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              fill
            />
          </div>
          <div className="flex flex-col gap-1 p-2">
            <h1 className="mb-2 text-sm font-semibold">{service.name}</h1>
            <p className="text-xs text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">
                {formatCurrencyBRL(Number(service.price))}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBookingClick}
              >
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet do agendamento */}
      <Sheet
        open={bookingSheetIsopen}
        onOpenChange={handleBookingSheetIsopenChange}
      >
        <SheetContent className="p-0">
          <SheetHeader className="border-b border-solid py-3">
            <SheetTitle className="text-center">Fazer reserva</SheetTitle>
          </SheetHeader>
          <div className="border-b border-solid py-5">
            <Calendar
              mode="single"
              locale={ptBR}
              selected={selectedDay}
              onSelect={handleDateSelect}
              fromDate={new Date()}
              styles={{
                head_cell: {
                  width: "100%",
                  textTransform: "capitalize",
                },
                cell: {
                  width: "100%",
                },
                button: {
                  width: "100%",
                },
                nav_button_previous: {
                  width: "32px",
                  height: "32px",
                },
                nav_button_next: {
                  width: "32px",
                  height: "32px",
                },
                caption: {
                  textTransform: "capitalize",
                },
              }}
            />
          </div>

          {selectedDay && (
            <>
              <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                {getTimeList(dayBookings).length > 0 ? (
                  getTimeList(dayBookings).map((hour) => (
                    <Button
                      key={hour}
                      className="rounded-full"
                      variant={selectedTime === hour ? "default" : "outline"}
                      onClick={() => handleTimeSelect(hour)}
                    >
                      {hour}
                    </Button>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400">
                    Nenhum horário disponível para o dia selecionado.
                  </p>
                )}
              </div>
            </>
          )}

          {selectedDay && (
            <>
              <div className="p-5">
                <Card>
                  <CardContent className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold">{service.name}</h2>
                      <p className="text-sm font-bold">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Data</h2>
                      <p className="text-sm">
                        {format(selectedDay, "d 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Horário</h2>
                      <p className="text-sm">{selectedTime}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Barbearia</h2>
                      <p className="text-sm">{barbershop?.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          <SheetFooter className="mt-5 px-5">
            <Button
              onClick={handleCreatingBooking}
              disabled={!selectedDay || !selectedTime}
            >
              Confirmar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog do Login */}
      <Dialog open={signInDialogIsOpen} onOpenChange={setSignInDialogIsOpen}>
        <DialogContent className="w-[90%] rounded-xl">
          <SigninDialog />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceItem;
