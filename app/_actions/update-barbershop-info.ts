"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import db from "../_lib/prisma"; // Ajuste o caminho
import { auth } from "../_lib/auth-option"; // Ajuste o caminho

// Interface para os dados a serem atualizados
interface UpdateBarbershopInfoParams {
  barbershopId: string;
  name: string;
  address: string;
  phones: string[];
  description: string;
}

export const updateBarbershopInfo = async (
  params: UpdateBarbershopInfoParams,
) => {
  // 1. Verificar autenticação
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." };
  }

  // Opcional: Verificar se o usuário é dono/admin da barbershopId
  // const barbershop = await db.barbershop.findUnique({ where: { id: params.barbershopId } });
  // if (!barbershop || barbershop.userId !== session.user.id) {
  //   return { success: false, error: "Não autorizado." };
  // }

  try {
    // 2. Atualizar os dados no banco
    await db.barbershop.update({
      where: {
        id: params.barbershopId,
        // Adicionar verificação de userId aqui também é uma boa prática
        // userId: session.user.id,
      },
      data: {
        name: params.name,
        address: params.address,
        phones: params.phones,
        description: params.description,
      },
    });

    // 3. Revalidar caches
    revalidatePath(`/admin/barbershops/${params.barbershopId}`);
    revalidatePath("/barbershops"); // Se nome/endereço aparecem na listagem
    revalidatePath(`/barbershops/${params.barbershopId}`); // Página pública

    return { success: true, error: null };
  } catch (error) {
    console.error("Erro ao atualizar informações da barbearia:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Exemplo: Tratar erro de constraint única (nome)
      if (
        error.code === "P2002" &&
        (error.meta?.target as string[])?.includes("name")
      ) {
        return {
          success: false,
          error: "Já existe uma barbearia com este nome.",
        };
      }
      // Erro P2025: Registro não encontrado para atualizar
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Barbearia não encontrada para atualização.",
        };
      }
    }
    return {
      success: false,
      error: "Erro inesperado ao atualizar informações.",
    };
  }
};
