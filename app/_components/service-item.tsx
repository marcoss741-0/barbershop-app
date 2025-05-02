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
import { useEffect, useMemo, useState } from "react";
import { format, isPast, isToday, set } from "date-fns";
import { Pick } from "@prisma/client/runtime/library";
import { toast } from "sonner";
import creatingBooking from "../_actions/creating-booking";
import { useSession } from "next-auth/react";
import { cachedGetBookings } from "../_actions/get-bookings";
import { Dialog, DialogContent } from "./ui/dialog";
import SigninDialog from "./signin-dialog";
import BookingResume from "./booking-resume";
import { useRouter } from "next/navigation";

interface BarbershopServicesProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name" | "id">;
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

interface GetTimeListProps {
  bookings: Booking[];
  selectedDay: Date;
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);

    const timeIsOnThePast = isPast(set(new Date(), { hours: hour, minutes }));
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false;
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    );
    if (hasBookingOnCurrentTime) {
      return false;
    }
    return true;
  });
};

const ServiceItem = ({ service, barbershop }: BarbershopServicesProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [bookingSheetIsopen, setBookingSheetIsopen] = useState(false);
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false);

  const { data } = useSession();
  const router = useRouter();

  //converted the service to json and then parsed it again to avoid the serialization error
  const jsonService = JSON.parse(JSON.stringify(service));

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDay) return;
      await cachedGetBookings({
        date: selectedDay,
        serviceId: jsonService.id,
      }).then((res) => {
        setDayBookings(res);
      });
    };
    fetchBookings();
  }, [selectedDay, jsonService.id]);

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return;
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    });
  }, [selectedDay, selectedTime]);

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
      if (!selectedDate) return;

      await creatingBooking({
        date: selectedDate,
        barbershopServiceId: service.id,
        barbershopId: barbershop.id
      });

      toast("Agendamento realizado!", {
        description: `Agendado para o dia: ${format(
          selectedDate,
          "dd/MM/yyyy 'as' HH:mm",
        )}`,
        action: {
          label: "Ver Agendamentos",
          onClick: () => {
            router.push("/bookings");
          },
        },
      });

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

  const timeList = useMemo(() => {
    if (!selectedDay) return [];
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    });
  }, [dayBookings, selectedDay]);
  return (
    <>
      {/* Card do serviço */}
      <Card className="w-full py-1">
        <CardContent className="flex w-full items-center justify-between gap-3 px-2 font-medium text-foreground">
          <div className="relative max-h-28 min-h-28 min-w-28 max-w-28">
            <Image
              className="rounded-lg object-cover"
              alt={jsonService.name}
              src={jsonService.imageUrl}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              fill
            />
          </div>
          <div className="flex flex-col gap-1 p-2">
            <h1 className="mb-2 text-sm font-semibold">{jsonService.name}</h1>
            <p className="text-xs">{jsonService.description}</p>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">
                {formatCurrencyBRL(Number(jsonService.price))}
              </p>
              <Button
                variant="default"
                size="sm"
                className="border"
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
        <SheetContent className="max-h-screen w-[90%] overflow-y-auto p-4 sm:p-6 [&::-webkit-scrollbar]:hidden">
          <SheetHeader className="border-b border-solid py-3">
            <SheetTitle className="text-center text-lg font-semibold">
              Fazer reserva
            </SheetTitle>
          </SheetHeader>

          <div className="border-b border-solid py-5 font-medium text-foreground">
            <Calendar
              mode="single"
              locale={ptBR}
              selected={selectedDay}
              onSelect={handleDateSelect}
              fromDate={new Date()}
              className="font-medium"
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
            <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
              {timeList.length > 0 ? (
                timeList.map((hour, index) => (
                  <Button
                    key={index}
                    className="rounded-full"
                    variant={selectedTime === hour ? "default" : "outline"}
                    onClick={() => handleTimeSelect(hour)}
                    aria-label={`Selecionar horário ${hour}`}
                  >
                    {hour}
                  </Button>
                ))
              ) : (
                <p className="text-center text-sm text-foreground">
                  Nenhum horário disponível para o dia selecionado.
                </p>
              )}
            </div>
          )}

          {selectedDate && (
            <div className="p-5">
              <BookingResume
                barbershop={barbershop}
                service={service}
                selectedDate={selectedDate}
              />
            </div>
          )}

          <SheetFooter className="mb-5 px-5">
            <Button
              onClick={handleCreatingBooking}
              disabled={!selectedDate}
              className="w-full font-semibold text-foreground sm:w-auto"
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
