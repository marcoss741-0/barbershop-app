"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";

export const deleteBooking = async (bookingId: string) => {
  return await db.booking.delete({
    where: {
      id: bookingId,
    },
  });
};

revalidatePath("/bookings");
revalidatePath("/barbershops/[id]", "page");
revalidatePath("/barbershops");
revalidatePath("/");
