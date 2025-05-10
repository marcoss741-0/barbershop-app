import db from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

import { EditBarbershopInfoForm } from "@/app/_components/edit-barbershop-info";
import { ManageBarbershopServices } from "@/app/_components/manage-barbershop-service";
import { UploadBarbershopImage } from "@/app/_components/upload-barbershop-image";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { ArrowLeftCircleIcon, Terminal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

interface BarbershopDetailsPageProps {
  params: {
    id: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  // 1. Buscar os dados da barbearia pelo ID
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: {
        include: {
          Service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  const standardServices = await db.service.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // 2. Se não encontrar, retornar página 404
  if (!barbershop) {
    return notFound();
  }

  // 3. Estrutura do Painel de Gestão
  return (
    <div className="container mx-auto px-5 py-8">
      <div className="mb-4 flex items-center gap-3 space-x-3">
        <Button variant="ghost" size="default" asChild>
          <Link href="/">
            <ArrowLeftCircleIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-medium text-primary">{barbershop.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Seção 1: Editar Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <EditBarbershopInfoForm barbershop={barbershop} />
          </CardContent>
        </Card>

        {/* Seção 2: Imagem Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil da Barbearia</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            {barbershop.imageUrl ? (
              <></>
            ) : (
              <Alert className="mb-8">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ooops!</AlertTitle>
                <AlertDescription>
                  Vôce não possui{" "}
                  <span className="font-bold uppercase text-primary">
                    nenhum
                  </span>{" "}
                  papel de parede cadastrado!
                </AlertDescription>
              </Alert>
            )}

            <UploadBarbershopImage
              barbershopId={barbershop.id}
              currentImageUrl={barbershop.imageUrl}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Serviços Oferecidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ManageBarbershopServices
              barbershopId={barbershop.id}
              existingServices={barbershop.services}
              standardServices={standardServices}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
