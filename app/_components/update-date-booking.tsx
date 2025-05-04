"use client";

import * as React from "react";
import { addDays, format, isPast, isToday, set } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { ptBR } from "date-fns/locale";
import { TIME_LIST } from "./service-item";
import { useEffect, useMemo, useState } from "react";
import { Booking } from "@prisma/client";
import { cachedGetBookings } from "../_actions/get-bookings";
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "sonner";

interface DatePickerParams {
  bookingId: string;
  serviceId: string;
}

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
        new Date(booking.date).getHours() === hour &&
        new Date(booking.date).getMinutes() === minutes,
    );
    if (hasBookingOnCurrentTime) {
      return false;
    }
    return true;
  });
};

export function DatePicker({ bookingId, serviceId }: DatePickerParams) {
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDay) return;
      await cachedGetBookings({
        date: selectedDay,
        serviceId,
      }).then((res) => {
        setDayBookings(res);
      });
    };
    fetchBookings();
  }, [selectedDay]);

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return;
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    });
  }, [selectedDay, selectedTime]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const timeList = useMemo(() => {
    if (!selectedDay) return [];
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    });
  }, [dayBookings, selectedDay]);

  const setUpdateBooking = async (newDate: Date) => {
    // const updateCurrentBooking = await updateBooking(bookingId, newDate);
    const data = new FormData();
    data.append("bookingId", bookingId);
    data.append("newDate", newDate.toISOString());

    const response = await fetch("/api/bookings", {
      method: "POST",
      body: data,
    });

    switch (response.status) {
      case 201:
        toast.success("Reagendado com sucesso!");
        break;
      case 400:
        toast.warning("Erro Inesperado ao realizar o processo!");
        break;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start pl-2 text-left font-normal capitalize",
            !selectedDay && "text-muted-foreground",
          )}
        >
          <CalendarIcon size={16} className="mr-1" />
          {selectedDay ? (
            format(selectedDay, "eeeeee dd MMM", { locale: ptBR })
          ) : (
            <span className="ml-2 text-xs font-semibold">Reagendar</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) =>
            setSelectedDay(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a nova data" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="1">Amanhã</SelectItem>
            <SelectItem value="3">Em 3 dias</SelectItem>
            <SelectItem value="7">En um Semana</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border p-2">
          <Calendar
            locale={ptBR}
            mode="single"
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
          <div className="flex w-[220px] gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
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
        <PopoverClose asChild>
          <Button
            variant="default"
            className="w-full"
            onClick={() => setUpdateBooking(selectedDate)}
            disabled={!selectedDay && !selectedTime}
          >
            Confirmar
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
