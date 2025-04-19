"use server";

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

export default creatingBooking;
