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
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};
