"use server";

import { error } from "console";
import db from "../_lib/prisma";
import { auth } from "@/app/_lib/auth-option";
import { revalidatePath } from "next/cache";

export async function setRating(barbershopId: string, rating: number) {
  const userId = (await auth())?.user?.id;

  try {
    if (!userId) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // const userHasRating = await db.rating.findFirst({
    //   where: {
    //     userId,
    //   },
    // });

    // const hasRating = !!userHasRating;
    // if (hasRating == true) {
    //   return { success: false, message: "Usuário Já Avaliou esta Barbearia" };
    // }

    const evaluateBarbershop = await db.rating.create({
      data: {
        barbershopId,
        userId,
        rating,
      },
    });

    const statusRating = !!evaluateBarbershop;

    if (statusRating == true) {
      return { success: true, message: "Avaliação confirmada!" };
    }

    revalidatePath("/");
    revalidatePath(`/barbershops/${evaluateBarbershop.id}`);

    return { success: false, error: "Erro ao avaliar a barbearia" };
  } catch (error) {
    return { success: false, error: "Erro inesperado!" };
  }
}
