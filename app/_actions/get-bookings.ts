"use server";

import { endOfDay, startOfDay } from "date-fns";
import { unstable_cache } from "next/cache";
import db from "../_lib/prisma";

interface GetBookingsProps {
  date: Date;
  serviceId?: string;
}

export const getBookings = async ({ date, serviceId }: GetBookingsProps) => {
  return db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
      ...(serviceId && { barbershopServiceId: serviceId }),
    },
  });
};

export const cachedGetBookings = unstable_cache(getBookings, ["getBookings"], {
  tags: ["getBookings"],
  revalidate: 60,
});
