import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const creativeNames = [
      "Barbearia Alpha",
      "Barbearia Beta",
      "Barbearia Gama",
      "Barbearia Delta",
      "Barbearia Épsilon",
      "Barbearia Zeta",
      "Barbearia Ômega",
      "Barbearia Lux",
      "Barbearia Urbana",
      "Barbearia Vip",
    ];
    const addresses = creativeNames.map(
      (_, i) => `Rua Exemplo ${i + 1}, São Paulo - SP`,
    );
    const images = creativeNames.map(
      (_, i) => `https://picsum.photos/400/400?random=${i}`,
    );

    const users = Array.from({ length: 10 }, (_, i) => ({
      name: `Usuário ${i + 1}`,
      email: `teste${i + 1}@gmail.com`,
    }));

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ];

    // Criar serviços uma vez só
    const createdServices = await Promise.all(
      services.map((service) =>
        prisma.service.upsert({
          where: { name: service.name },
          update: {},
          create: service,
        }),
      ),
    );

    for (let i = 0; i < 10; i++) {
      const name = creativeNames[i];
      const address = addresses[i];
      const imageUrl = images[i];
      const user = users[i];

      const barbershop = await prisma.barbershop.create({
        data: {
          name,
          address,
          imageUrl,
          phones: ["(11) 99999-9999", "(11) 88888-8888"],
          description: "Lorem ipsum dolor sit amet...",
          user: {
            connectOrCreate: {
              where: { email: user.email },
              create: {
                name: user.name,
                email: user.email,
              },
            },
          },
        },
      });

      // Associar serviços existentes a cada barbearia
      await Promise.all(
        createdServices.map((service) => {
          if (
            !service.name ||
            !service.description ||
            !service.price ||
            !service.imageUrl
          ) {
            throw new Error(
              `Dados incompletos para o serviço com ID ${service.id}`,
            );
          }

          return prisma.barbershopService.create({
            data: {
              barbershopId: barbershop.id,
              serviceId: service.id,
              name: service.name,
              description: service.description,
              price: service.price,
              imageUrl: service.imageUrl,
            },
          });
        }),
      );
    }

    await prisma.$disconnect();
    console.log("Seed finalizado com sucesso.");
  } catch (error) {
    console.error("Erro ao fazer seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedDatabase();
