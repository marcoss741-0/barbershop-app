"use server";

import { endOfDay, startOfDay } from "date-fns";
import db from "../_lib/prisma";
import { unstable_cache } from "next/cache";

interface GetBookingsProps {
  serviceId?: string;
  date: Date;
}

export const getBookings = ({ date }: GetBookingsProps) => {
  return db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });
};

export const cachedGetBookings = unstable_cache(getBookings, ["getBookings"], {
  tags: ["getBookings"],
  revalidate: 60,
});
