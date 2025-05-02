"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";
import { auth } from "../_lib/auth-option";

interface CreatingBookingParams {
  barbershopServiceId: string;
  barbershopId: string;
  date: Date;
}

const creatingBooking = async (params: CreatingBookingParams) => {
  const user = await auth();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  await db.booking.create({
    data: {
      date: params.date,
      userId: (user.user as { id: string }).id,
      barbershopId: params.barbershopId,
      barbershopServiceId: params.barbershopServiceId,
    },
  });
};

revalidatePath("/barbershops/[id]", "page");
revalidatePath("/barbershops");
revalidatePath("/bookings");
revalidatePath("/");

export default creatingBooking;
