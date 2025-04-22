"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth-option";

interface CreatingBookingParams {
  serviceId: string;
  date: Date;
}

const creatingBooking = async (params: CreatingBookingParams) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  await db.booking.create({
    data: {
      ...params,
      userId: (user.user as { id: string }).id,
    },
  });
};

revalidatePath("/barbershops/[id]", "page");
revalidatePath("/barbershops");
revalidatePath("/bookings");
revalidatePath("/");

export default creatingBooking;
