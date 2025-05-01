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
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
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
  return await db.booking.findMany({
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
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
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
    // Retorna null ou lança um erro, dependendo do comportamento desejado
    return null;
  }

  const bookings = await db.booking.findMany({
    where: {
      service: {
        barbershop: {
          userId: userId, // Relaciona as barbearias ao usuário
        },
      },
    },
    include: {
      user: true, // Inclui informações do usuário que fez o agendamento
      service: {
        include: {
          barbershop: true, // Inclui informações da barbearia
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return bookings;
};

export const countBookingsByUserBarbershops = async (userId: string) => {
  if (!userId) {
    return null;
  }

  const bookingCount = await db.booking.count({
    where: {
      service: {
        barbershop: {
          userId,
        },
      },
    },
  });

  return bookingCount;
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
