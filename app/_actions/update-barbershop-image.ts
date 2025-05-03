"use server";

import { revalidatePath } from "next/cache";
import db from "../_lib/prisma"; // Ajuste o caminho
import { auth } from "../_lib/auth-option"; // Ajuste o caminho
import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer";

// Configurar Cloudinary (AS VARIÁVEIS DEVEM ESTAR NO SEU .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateBarbershopImage = async (formData: FormData) => {
  // 1. Verificar autenticação
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Usuário não autenticado.",
    };
  }

  // 2. Obter dados do FormData
  const file = formData.get("file") as File | null;
  const barbershopId = formData.get("barbershopId") as string | null;

  if (!file || !barbershopId) {
    return {
      success: false,
      error: "Arquivo ou ID da barbearia não fornecido.",
    };
  }

  // Opcional: Verificar autorização (usuário é dono/admin da barbearia?)
  // const barbershop = await db.barbershop.findUnique({ where: { id: barbershopId } });
  // if (!barbershop || barbershop.userId !== session.user.id) {
  //   return { success: false, error: "Não autorizado." };
  // }

  try {
    // 3. Converter arquivo para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Fazer upload para Cloudinary
    const uploadResponse = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "barbershop_images", // Pasta opcional no Cloudinary
            // public_id: barbershopId, // Pode usar o ID como nome do arquivo (cuidado com colisões se reutilizar)
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    })) as { secure_url: string }; // Tipagem esperada da resposta

    if (!uploadResponse?.secure_url) {
      throw new Error("Falha no upload para Cloudinary");
    }

    const imageUrl = uploadResponse.secure_url;

    // 5. Atualizar o campo imageUrl no banco de dados
    await db.barbershop.update({
      where: {
        id: barbershopId,
        // Adicionar verificação de userId aqui também é uma boa prática de segurança
        // userId: session.user.id,
      },
      data: {
        imageUrl: imageUrl,
      },
    });

    // 6. Revalidar o cache da página da barbearia e outras relevantes
    revalidatePath(`/admin/barbershops/${barbershopId}`);
    revalidatePath("/barbershops"); // Se a imagem aparece na listagem
    revalidatePath(`/barbershops/${barbershopId}`); // Página pública da barbearia

    return {
      success: true,
      error: null,
      imageUrl: imageUrl,
    };
  } catch (error) {
    console.error("Erro ao atualizar imagem da barbearia:", error);
    return {
      success: false,
      error: "Ocorreu um erro inesperado durante o upload da imagem.",
    };
  }
};
