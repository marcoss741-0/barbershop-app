"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";

export const updateBooking = async (bookingId: string, reactantDate: Date) => {
  try {
    const upBooking = await db.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        date: reactantDate,
      },
    });

    revalidatePath("/");

    return upBooking;
  } catch (error: any) {
    throw new Error(error.message || "Erro ao atualizar agendamento.");
  }
};
