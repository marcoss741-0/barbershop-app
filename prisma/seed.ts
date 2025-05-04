import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const baseServices = [
    {
      name: "Corte de Cabelo",
      description: "Estilo personalizado com as últimas tendências.",

      imageUrl:
        "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
    },
    {
      name: "Barba",
      description: "Modelagem completa para destacar sua masculinidade.",

      imageUrl:
        "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
    },
    {
      name: "Pézinho",
      description: "Acabamento perfeito para um visual renovado.",

      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
    },
    {
      name: "Sobrancelha",
      description: "Expressão acentuada com modelagem precisa.",

      imageUrl:
        "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
    },
    {
      name: "Massagem",
      description: "Relaxe com uma massagem revigorante.",

      imageUrl:
        "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
    },
    {
      name: "Hidratação",
      description: "Hidratação profunda para cabelo e barba.",

      imageUrl:
        "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
    },
    {
      name: "Alisamento",
      description:
        "Deixe seu cabelo liso e alinhado com um tratamento profissional.",

      imageUrl: "https://utfs.io/f/12345678-alisamento.png",
    },
    {
      name: "Coloração",
      description: "Renove seu visual com uma coloração moderna e estilosa.",

      imageUrl: "https://utfs.io/f/12345678-coloracao.png",
    },
    {
      name: "Descoloração/Platinado",
      description: "Renove seu visual com uma coloração moderna e estilosa.",

      imageUrl: "https://utfs.io/f/12345678-coloracao.png",
    },
    {
      name: "Desenho na Barba",
      description: "Personalize sua barba com desenhos únicos e criativos.",

      imageUrl: "https://utfs.io/f/12345678-desenho-barba.png",
    },
    {
      name: "Tratamento Capilar",
      description:
        "Cuide da saúde do seu couro cabeludo e fios com um tratamento especial.",
      imageUrl: "https://utfs.io/f/12345678-tratamento-capilar.png",
    },
    {
      name: "Luzes",
      description: "Adicione estilo ao seu cabelo com luzes bem feitas.",

      imageUrl: "https://utfs.io/f/12345678-luzes.png",
    },
    {
      name: "Barba Terapêutica",
      description: "Hidratação e cuidados especiais para sua barba.",

      imageUrl: "https://utfs.io/f/12345678-barba-terapeutica.png",
    },
    {
      name: "Corte Infantil",
      description:
        "Corte de cabelo especial para crianças, com cuidado e paciência.",

      imageUrl: "https://utfs.io/f/12345678-corte-infantil.png",
    },
    {
      name: "Pintura de Barba",
      description: "Realce sua barba com uma pintura profissional.",
      imageUrl: "https://utfs.io/f/12345678-pintura-barba.png",
    },
    {
      name: "Relaxamento Capilar",
      description: "Deixe seus fios mais soltos e fáceis de modelar.",
      imageUrl: "https://utfs.io/f/12345678-relaxamento.png",
    },
  ];

  console.log(`Start seeding base services...`);
  for (const serviceData of baseServices) {
    const service = await db.service.upsert({
      where: { name: serviceData.name }, // Usa o nome como identificador único
      update: {},
      create: serviceData,
    });
    console.log(
      `Created/updated service with id: ${service.id} (${service.name})`,
    );
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
