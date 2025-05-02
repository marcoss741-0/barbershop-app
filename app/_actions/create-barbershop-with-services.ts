"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import db from "../_lib/prisma"; // Ajuste o caminho conforme sua estrutura
import { auth } from "../_lib/auth-option"; // Ajuste o caminho conforme sua estrutura

// Interface para os detalhes de cada serviço a ser vinculado
interface ServiceDetail {
  serviceName: string; // Nome do serviço padrão (ex: "Corte", "Barba")
  displayName?: string; // Nome customizado para exibir nesta barbearia (opcional)
  description: string; // Descrição específica para esta barbearia
  price: number; // Preço específico para esta barbearia (use number, Prisma converte para Decimal)
  imageUrl: string; // URL da imagem para este serviço nesta barbearia
}

// Interface para os dados da nova barbearia
interface BarbershopData {
  name: string;
  address: string;
  phones: string[];
  description: string;
  imageUrl: string;
  // userId será pego da sessão
}

// Interface para os parâmetros da Server Action
interface CreateBarbershopParams {
  barbershopData: BarbershopData;
  serviceDetails: ServiceDetail[];
}

export const createBarbershopWithServices = async ({
  barbershopData,
  serviceDetails,
}: CreateBarbershopParams) => {
  // 1. Verificar autenticação e obter ID do usuário
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Usuário não autenticado.",
    };
  }
  const userId = session.user.id;

  // Opcional: Adicionar verificação de autorização (ex: usuário é admin?)

  try {
    // 2. Encontrar os IDs dos serviços padrão existentes
    const standardServiceNames = serviceDetails.map(
      (detail) => detail.serviceName,
    );
    const standardServices = await db.service.findMany({
      where: {
        name: { in: standardServiceNames },
      },
      select: { id: true, name: true },
    });

    // Mapear nomes para IDs para fácil acesso
    const serviceNameToIdMap = standardServices.reduce(
      (map, service) => {
        map[service.name] = service.id;
        return map;
      },
      {} as Record<string, string>,
    );

    // Verificar se todos os serviços padrão foram encontrados
    for (const detail of serviceDetails) {
      if (!serviceNameToIdMap[detail.serviceName]) {
        return {
          success: false,
          error: `Serviço padrão "${detail.serviceName}" não encontrado. Cadastre-o primeiro ou verifique o nome.`,
        };
      }
    }

    // 3. Iniciar a transação Prisma
    const newBarbershop = await db.$transaction(async (tx) => {
      // 4. Criar a nova barbearia dentro da transação
      const createdBarbershop = await tx.barbershop.create({
        data: {
          ...barbershopData,
          userId: userId, // Associar ao usuário logado
        },
      });

      // 5. Preparar os dados para criar os registros em BarbershopService
      const barbershopServiceCreateData = serviceDetails.map((detail) => {
        const serviceId = serviceNameToIdMap[detail.serviceName];
        // Convert price to Decimal compatible format if needed, Prisma handles number conversion
        const priceDecimal = new Prisma.Decimal(detail.price);

        return {
          name: detail.displayName || detail.serviceName,
          description: detail.description,
          price: priceDecimal,
          imageUrl: detail.imageUrl,
          barbershopId: createdBarbershop.id,
          serviceId: serviceId,
        };
      });

      // 6. Criar os múltiplos registros em BarbershopService dentro da transação
      await tx.barbershopService.createMany({
        data: barbershopServiceCreateData,
      });

      // 7. Retornar a barbearia criada
      return createdBarbershop;
    });

    // 8. Revalidar caches após sucesso da transação
    revalidatePath("/"); // Revalida a página inicial
    revalidatePath("/barbershops"); // Revalida a página de listagem de barbearias
    revalidatePath(`/admin/barbershops`); // Revalida a página de admin (se existir)
    // Adicione outros paths que precisam ser revalidados

    return {
      success: true,
      data: newBarbershop,
    };
  } catch (error) {
    console.error("Erro ao criar barbearia com serviços:", error);
    // Verificar se é um erro conhecido do Prisma ou outro tipo
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Exemplo: Tratar erro de constraint única
      if (error.code === "P2002") {
        return {
          success: false,
          error:
            "Erro de constraint: Verifique dados únicos (ex: nome da barbearia?).",
        };
      }
    }
    return {
      success: false,
      error: "Ocorreu um erro inesperado ao criar a barbearia.",
    };
  }
};
