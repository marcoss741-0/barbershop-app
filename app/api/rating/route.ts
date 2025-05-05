import { setRating } from "@/app/_actions/set-rating";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { barbershopId, userId, rating } = await req.json();

  if (!userId || !barbershopId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  try {
    const response = await setRating(barbershopId, rating);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao criar usuário." },
      { status: 400 },
    );
  }
}
