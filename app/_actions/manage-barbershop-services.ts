"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import db from "../_lib/prisma"; // Ajuste o caminho
import { auth } from "../_lib/auth-option"; // Ajuste o caminho

// --- Action para ADICIONAR um serviço específico à barbearia ---

interface AddBarbershopServiceParams {
  barbershopId: string;
  serviceId: string; // ID do serviço padrão (da tabela Service)
  name: string; // Nome de exibição para este serviço nesta barbearia
  description: string;
  price: number; // Recebe como número
  imageUrl: string;
}

export const addBarbershopService = async (params: AddBarbershopServiceParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." };
  }

  // Opcional: Verificar se o usuário é dono/admin da barbershopId

  try {
    // Verificar se o serviço padrão existe
    const standardService = await db.service.findUnique({
      where: { id: params.serviceId },
    });
    if (!standardService) {
      return { success: false, error: "Serviço padrão não encontrado." };
    }

    // Verificar se já existe um BarbershopService para esta combinação
    const existingLink = await db.barbershopService.findFirst({
        where: {
            barbershopId: params.barbershopId,
            serviceId: params.serviceId,
        }
    });
    if (existingLink) {
        return { success: false, error: "Este serviço padrão já está vinculado a esta barbearia." };
    }

    const priceDecimal = new Prisma.Decimal(params.price);

    await db.barbershopService.create({
      data: {
        name: params.name,
        description: params.description,
        price: priceDecimal,
        imageUrl: params.imageUrl,
        barbershopId: params.barbershopId,
        serviceId: params.serviceId,
      },
    });

    revalidatePath(`/admin/barbershops/${params.barbershopId}`);
    return { success: true, error: null };

  } catch (error) {
    console.error("Erro ao adicionar serviço à barbearia:", error);
    return { success: false, error: "Erro inesperado." };
  }
};

// --- Action para ATUALIZAR um serviço específico da barbearia ---

interface UpdateBarbershopServiceParams {
  barbershopServiceId: string; // ID do BarbershopService a ser atualizado
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const updateBarbershopService = async (params: UpdateBarbershopServiceParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." };
  }

  // Opcional: Verificar se o usuário é dono/admin da barbearia associada a este barbershopServiceId

  try {
    const priceDecimal = new Prisma.Decimal(params.price);

    const updatedService = await db.barbershopService.update({
      where: {
        id: params.barbershopServiceId,
      },
      data: {
        name: params.name,
        description: params.description,
        price: priceDecimal,
        imageUrl: params.imageUrl,
      },
      select: { barbershopId: true } // Selecionar barbershopId para revalidação
    });

    revalidatePath(`/admin/barbershops/${updatedService.barbershopId}`);
    return { success: true, error: null };

  } catch (error) {
    console.error("Erro ao atualizar serviço da barbearia:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return { success: false, error: "Serviço específico não encontrado." };
    }
    return { success: false, error: "Erro inesperado." };
  }
};

// --- Action para DELETAR um serviço específico da barbearia ---

interface DeleteBarbershopServiceParams {
  barbershopServiceId: string; // ID do BarbershopService a ser deletado
}

export const deleteBarbershopService = async (params: DeleteBarbershopServiceParams) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." };
  }

  // Opcional: Verificar se o usuário é dono/admin da barbearia associada

  try {
    // Primeiro, buscar o barbershopId para revalidação antes de deletar
    const serviceToDelete = await db.barbershopService.findUnique({
        where: { id: params.barbershopServiceId },
        select: { barbershopId: true }
    });

    if (!serviceToDelete) {
        return { success: false, error: "Serviço específico não encontrado." };
    }

    await db.barbershopService.delete({
      where: {
        id: params.barbershopServiceId,
      },
    });

    revalidatePath(`/admin/barbershops/${serviceToDelete.barbershopId}`);
    return { success: true, error: null };

  } catch (error) {
    console.error("Erro ao deletar serviço da barbearia:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Pode acontecer se já foi deletado
        return { success: false, error: "Serviço específico não encontrado." };
    }
    return { success: false, error: "Erro inesperado." };
  }
};

