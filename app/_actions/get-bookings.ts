"use server";

import { endOfDay, startOfDay } from "date-fns";
import { unstable_cache } from "next/cache";
import db from "../_lib/prisma";

interface GetBookingsProps {
  date: Date;
}

export const getBookings = async ({ date }: GetBookingsProps) => {
  return await db.booking.findMany({
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
