"use client";

import { useEffect, useState } from "react";
import BookingItem from "./booking-item";

const BookingsContainer = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings", { method: "GET" });
        if (!response.ok) {
          return {
            success: false,
            message: "Não foi possível obter os dados!",
          };
        }

        setBookings(await response.json());
      } catch (err) {
        console.log(err);
      }
    }

    fetchBookings();
  }, []);
  return (
    <>
      <h3 className="text-[16px] font-semibold text-foreground">
        AGENDAMENTOS
      </h3>
      <div className="flex min-w-full gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={{
                id: booking.id,
                userId: booking.userId,
                date: booking.date,
                barbershopId: booking.barbershopId,
                barbershopServiceId: booking.barbershopServiceId,
                barbershop: booking.barbershop,
                barbershopService: booking.barbershopService,
              }}
            />
          ))
        ) : (
          <div className="flex w-full items-center justify-center">
            <p className="text-sm font-medium text-secondary-foreground">
              Você não tem agendamentos
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsContainer;
