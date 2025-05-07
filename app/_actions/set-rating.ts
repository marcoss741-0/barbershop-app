"use server";

import db from "../_lib/prisma";
import { auth } from "@/app/_lib/auth-option";
import { revalidatePath } from "next/cache";

export async function setRating(barbershopId: string, rating: number) {
  const userId = (await auth())?.user?.id;

  try {
    if (!userId) {
      return { success: false, message: "Usuário não autenticado" };
    }

    const barbershop = await db.barbershop.findUnique({
      where: {
        id: barbershopId,
      },
    });

    if (!barbershop) {
      return {
        success: false,
        message: "Barbearia não encontrada",
      };
    }

    if (barbershop.userId === userId) {
      return {
        success: false,
        message: "O usuário não pode avaliar sua própria barbearia",
      };
    }

    // const userHasRating = await db.rating.findFirst({
    //   where: {
    //     userId,
    //     barbershopId,
    //   },
    // });

    // if (userHasRating) {
    //   return {
    //     success: false,
    //     message: "Usuário já avaliou esta barbearia",
    //   };
    // }

    await db.rating.create({
      data: {
        barbershopId,
        userId,
        rating,
      },
    });

    revalidatePath("/");
    revalidatePath("/barbershops");
    revalidatePath(`/barbershops/${barbershopId}`);

    return { success: true, message: "Avaliação confirmada!" };
  } catch (error) {
    return { success: false, error: "Erro inesperado!" };
  }
}
