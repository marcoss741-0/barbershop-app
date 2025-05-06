import creatingBooking from "@/app/_actions/creating-booking";
import { auth } from "@/app/_lib/auth-option";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos:", body);

    const { date, barbershopId, barbershopServiceId } = body;
    const userId = (await auth())?.user?.id;

    if (!date || !barbershopId || !barbershopServiceId || !userId) {
      // Se faltar algum dado, retorne erro 400
      return NextResponse.json(
        { error: "Dados obrigatórios faltando." },
        { status: 400 },
      );
    }

    const response = await creatingBooking({
      date: new Date(date),
      userId,
      barbershopId,
      barbershopServiceId,
    });

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: 400 });
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);

    // Se for erro conhecido, retorne 400, senão 500
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Erro interno ao criar agendamento." },
      { status },
    );
  }
}
