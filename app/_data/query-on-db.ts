import db from "../_lib/prisma";
import { auth } from "../_lib/auth-option";

export const queryBookings = async () => {
  const session = await auth();
  if (!session?.user) {
    return [];
  }
  return await db.booking.findMany({
    where: {
      userId: (session?.user as { id: string })?.id,
      date: {
        gte: new Date(),
      },
    },
    select: {
      barbershopService: true,
      barbershop: true,
      id: true,
      barbershopId: true,
      user: true,
      userId: true,
      date: true,
      barbershopServiceId: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const queryMostPopularBarber = async () => {
  return await db.barbershop.findMany({
    take: 5,
    orderBy: {
      name: "desc",
    },
  });
};

export const queryBarbershops = async () => {
  return await db.barbershop.findMany({});
};

export const queryBarbershopById = async (id: string) => {
  return await db.barbershop.findUnique({
    where: {
      id: id,
    },
    include: {
      services: true,
    },
  });
};

export const queryBarbershopServiceByName = async (
  service: string,
  title: string,
) => {
  return await db.barbershop.findMany({
    where: {
      OR: [
        title
          ? {
              name: {
                contains: title,
                mode: "insensitive",
              },
            }
          : {},
        service
          ? {
              services: {
                some: {
                  name: {
                    contains: service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  });
};

export const queryAllBookings = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Voce não esta logado!");
  }
  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as { id: string }).id,
      OR: [
        {
          date: {
            gte: new Date(),
          },
        },
        {
          date: {
            lte: new Date(),
          },
        },
      ],
    },
    select: {
      id: true,
      date: true,
      barbershopService: true,
      barbershop: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Mapeia os resultados para o formato esperado
  return bookings.map((booking) => ({
    id: booking.id,
    date: booking.date,
    barbershop: booking.barbershop,
    service: booking.barbershopService, // renomeia barbershopService para service
  }));
};

export const queryUser = async (email: string) => {
  const session = await auth();
  if (!session.user) {
    throw new Error("Usuario não esta logado!");
  }

  return await db.user.findUnique({
    where: { email },
  });
};

export const queryBarbershopByUser = async (userId?: string) => {
  if (!userId) {
    return null;
  }

  // Busca todas as barbearias do usuário dono
  const barbershops = await db.barbershop.findMany({
    where: { userId },
    select: { id: true },
  });

  const barbershopIds = barbershops.map((b) => b.id);

  // Busca todos os agendamentos nessas barbearias, trazendo os dados do usuário que fez o agendamento
  const bookings = await db.booking.findMany({
    where: {
      barbershopId: { in: barbershopIds },
    },
    select: {
      user: true, // Dados do usuário que fez o agendamento
      barbershop: true,
      barbershopService: true,
      date: true,
      id: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return bookings;
};

export const countBookingsByUserBarbershops = async (userId: string) => {
  if (!userId) {
    return null;
  }

  // Busca todas as barbearias do usuário
  const barbershops = await db.barbershop.findMany({
    where: { userId },
    select: { id: true },
  });

  const barbershopIds = barbershops.map((b) => b.id);

  // Conta os agendamentos feitos por outros usuários nessas barbearias
  const bookingCount = await db.booking.count({
    where: {
      barbershopId: { in: barbershopIds },
      userId: { not: userId }, // Exclui agendamentos feitos pelo próprio dono
    },
  });

  return bookingCount;
};

export const userHasBarbershop = async (userId: string) => {
  if (!userId) {
    return null;
  }

  const hasBarbershops = await db.barbershop.findUnique({
    where: {
      userId,
    },
  });

  return hasBarbershops;
};

export const availableServices = async () => {
  const services = await db.service.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return services;
};

export const createBarbershop = async (
  userId: string,
  barbershopData: {
    name: string;
    address: string;
    imageUrl: string;
    phones: string[];
    description: string;
    services: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
    }[];
  },
) => {
  // Verifica se o usuário já possui uma barbearia
  const existingBarbershop = await db.barbershop.findUnique({
    where: { userId },
  });

  if (existingBarbershop) {
    throw new Error("O usuário já possui uma barbearia.");
  }

  // Cria a barbearia
  return await db.barbershop.create({
    data: {
      name: barbershopData.name,
      address: barbershopData.address,
      imageUrl: barbershopData.imageUrl,
      phones: barbershopData.phones,
      description: barbershopData.description,
      user: {
        connect: { id: userId },
      },
      services: {
        create: barbershopData.services,
      },
    },
  });
};
