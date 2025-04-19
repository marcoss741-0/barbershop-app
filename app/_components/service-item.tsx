"use client";

import { Barbershop, BarbershopService } from "@prisma/client";
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
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { format, set } from "date-fns";
import { Pick } from "@prisma/client/runtime/library";
import { toast } from "sonner";
import creatingBooking from "../_actions/creating-booking";
import { useSession } from "next-auth/react";

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
  const { data } = useSession();

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
        userId: "cm9mxjbzy00015peok9wjhb1t",
      });

      toast.success("Agendamento realizado!!");
    } catch (error) {
      console.log(error);
      toast.error("Não foi possivel criar seu agendamento!");
    }
  };
  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3">
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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Reservar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SheetHeader className="border-b border-solid py-3">
                    <SheetTitle className="text-center">
                      Fazer reserva
                    </SheetTitle>
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
                        {TIME_LIST.map((hour) => (
                          <Button
                            key={hour}
                            className="rounded-full"
                            variant={
                              selectedTime === hour ? "default" : "outline"
                            }
                            onClick={() => handleTimeSelect(hour)}
                          >
                            {hour}
                          </Button>
                        ))}
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
                              <h2 className="text-sm text-gray-400">
                                Barbearia
                              </h2>
                              <p className="text-sm">{barbershop?.name}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <Button onClick={handleCreatingBooking}>Confirmar</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceItem;
