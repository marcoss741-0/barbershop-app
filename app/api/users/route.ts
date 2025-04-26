import { createUser } from "../../users/_actions/creating-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    const newUser = await createUser(name, email, password);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.message);
    return NextResponse.json(
      { error: error.message || "Erro ao criar usuário." },
      { status: 400 },
    );
  }
}
