"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import db from "../_lib/prisma"; // Ajuste o caminho conforme sua estrutura
import { auth } from "../_lib/auth-option"; // Ajuste o caminho conforme sua estrutura

// Interface para os dados básicos da nova barbearia
// imageUrl é opcional ou pode ser omitido/null inicialmente
interface BasicBarbershopData {
  name: string;
  address: string;
  phones: string[];
  description: string;
  imageUrl?: string | null; // Tornando opcional ou permitindo null
}

export const createBasicBarbershop = async (
  barbershopData: BasicBarbershopData
) => {
  // 1. Verificar autenticação e obter ID do usuário
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Usuário não autenticado.",
      barbershopId: null,
    };
  }
  const userId = session.user.id;

  // Opcional: Adicionar verificação de autorização (ex: usuário é admin?)

  try {
    // 2. Criar a nova barbearia com dados básicos
    const newBarbershop = await db.barbershop.create({
      data: {
        ...barbershopData,
        imageUrl: barbershopData.imageUrl || "", // Define um valor padrão se não fornecido
        userId: userId, // Associar ao usuário logado
      },
    });

    // 3. Revalidar caches após sucesso
    revalidatePath("/barbershops"); // Revalida a página de listagem de barbearias
    revalidatePath(`/admin/barbershops`); // Revalida a página de admin (se existir)
    // Adicione outros paths que precisam ser revalidados

    return {
      success: true,
      error: null,
      barbershopId: newBarbershop.id, // Retorna o ID para redirecionamento
    };

  } catch (error) {
    console.error("Erro ao criar barbearia básica:", error);
    // Verificar se é um erro conhecido do Prisma ou outro tipo
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Exemplo: Tratar erro de constraint única (ex: nome já existe)
      if (error.code === 'P2002') {
        // Tenta identificar qual campo causou o erro, se possível
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('name')) {
          return { success: false, error: "Já existe uma barbearia com este nome.", barbershopId: null };
        }
        return { success: false, error: "Erro de constraint: Verifique dados únicos.", barbershopId: null };
      }
    }
    return {
      success: false,
      error: "Ocorreu um erro inesperado ao criar a barbearia.",
      barbershopId: null,
    };
  }
};

