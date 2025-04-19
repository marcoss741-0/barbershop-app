"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";

interface CreatingBookingParams {
  serviceId: string;
  userId: string;
  date: Date;
}

const creatingBooking = async (params: CreatingBookingParams) => {
  await db.booking.create({
    data: {
      ...params,
    },
  });
};

revalidatePath("/barbershops/[id]");

export default creatingBooking;
