import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";

export async function getRating(barbershopId: string) {
  const ratings = await db.rating.aggregate({
    where: { barbershopId },
    _avg: { rating: true },
    _count: { _all: true },
  });
  revalidatePath(`/barbershops/${barbershopId}`);
  revalidatePath("/barbershops");
  revalidatePath("/");

  return {
    average: ratings._avg.rating || 0,
    count: ratings._count._all,
  };
}
