import { auth } from "../../../_lib/auth-option";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao obter sessão" },
      { status: 500 },
    );
  }
}
