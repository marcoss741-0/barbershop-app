import { getRating } from "@/app/_actions/get-rating";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID não informado" }, { status: 400 });
  }

  try {
    const rating = await getRating(id);
    return NextResponse.json(rating, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar rating" },
      { status: 500 },
    );
  }
}
