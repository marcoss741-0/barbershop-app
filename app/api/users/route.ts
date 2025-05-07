import { createUser } from "../../users/_actions/creating-user";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { queryBarbershopByUser } from "@/app/_data/query-on-db";
import { auth } from "@/app/_lib/auth-option";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  // const { name, email, password } = await req.json();
  const data = await req.formData();
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile_picture",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });
    const imageUrl = (uploadResult as any).secure_url;

    const newUser = await createUser(name, email, password, imageUrl);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.message);
    return NextResponse.json(
      { error: error.message || "Erro ao criar usuário." },
      { status: 400 },
    );
  }
}
