"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma";

interface CreatingBookingParams {
  userId: string;
  barbershopServiceId: string;
  barbershopId: string;
  date: Date;
}

const creatingBooking = async (params: CreatingBookingParams) => {
  if (!params.userId) {
    return { success: false, message: "Usuário não autenticado" };
  }
  // Busque a barbearia do agendamento
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.barbershopId,
    },
  });

  // Verifique se o usuário é dono da barbearia
  if (barbershop?.userId === params.userId) {
    return {
      success: false,
      message: "O Usuário não pode agendar em sua própria Barbearia",
    };
  }

  try {
    await db.booking.create({
      data: {
        date: params.date,
        userId: params.userId,
        barbershopId: params.barbershopId,
        barbershopServiceId: params.barbershopServiceId,
      },
    });

    // Revalide os paths após criar o agendamento
    revalidatePath("/barbershops/[id]", "page");
    revalidatePath("/barbershops");
    revalidatePath("/bookings");
    revalidatePath("/");

    return { success: true, message: "Agendamento criado com sucesso" };
  } catch (error: any) {
    // Trate o erro e retorne uma mensagem amigável
    return {
      success: false,
      message: error.message || "Erro ao criar agendamento",
    };
  }
};

export default creatingBooking;
