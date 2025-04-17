import PhoneItem from "@/app/_components/phone-item";
import ServiceItem from "@/app/_components/service-item";
import { Button } from "@/app/_components/ui/button";
import db from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BarbershopPageProps {
  params: {
    id: string;
  };
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    return notFound();
  }

  return (
    <>
      <div>
        <div className="relative h-[250px] w-full">
          <Image
            src={barbershop!.imageUrl}
            fill
            className="object-cover"
            alt={barbershop!.name}
          />
          <Button
            size={"icon"}
            className="absolute left-4 top-4"
            variant="secondary"
            asChild
          >
            <Link href="/">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <Button
            size={"icon"}
            className="absolute right-4 top-4"
            variant="secondary"
          >
            <MenuIcon />
          </Button>
        </div>

        <div className="flex flex-col justify-start gap-2 border-b border-solid p-5">
          <h1 className="mt-2 text-xl font-bold">{barbershop.name}</h1>

          <div className="flex items-center gap-1">
            <MapPinIcon className="text-primary" size={18} />
            <p className="text-sm">{barbershop.address}</p>
          </div>

          <div className="flex items-center gap-1">
            <StarIcon size={18} className="fill-primary text-primary" />
            <p className="text-sm">5,0 (889 avaliações)</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-normal text-gray-400">SOBRE NÓS</h2>
          <p className="text-sm">{barbershop.description}</p>
        </div>

        <div className="flex flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-normal text-gray-400">SERVIÇOS</h2>

          {barbershop.services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-normal text-gray-400">CONTATO</h2>

          {barbershop.phones.map((phone) => (
            <PhoneItem phone={phone} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbershopPage;
