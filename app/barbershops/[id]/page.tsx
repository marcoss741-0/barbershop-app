import InfoBarberPage from "@/app/_components/info-barbershop-page";
import PhoneItem from "../../_components/phone-item";
import ServiceItem from "../../_components/service-item";
import SidebarSheet from "../../_components/sidebar-sheet";
import { Button } from "../../_components/ui/button";
import { Sheet, SheetTrigger } from "../../_components/ui/sheet";
import { queryBarbershopById } from "../../_data/query-on-db";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRating } from "@/app/_actions/get-rating";

interface BarbershopPageProps {
  params: {
    id: string;
  };
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await queryBarbershopById(params.id);

  if (!barbershop) {
    return notFound();
  }

  const { average, count } = await getRating(barbershop.id);

  return (
    <>
      <div>
        <div className="relative h-[250px] w-full">
          <Image
            src={barbershop.imageUrl}
            fill
            className="object-cover"
            alt={barbershop.name}
            priority
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

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size={"icon"}
                className="absolute right-4 top-4"
                variant="secondary"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>

        <div className="flex flex-col justify-start gap-2 border-b border-solid p-5">
          <InfoBarberPage
            avg={average.toFixed(2)}
            count={JSON.stringify(count)}
            barbershop={barbershop}
          />
        </div>

        <div className="flex w-full flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-medium text-foreground">SOBRE NÓS</h2>
          <p className="max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words text-sm">
            {barbershop.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-medium text-foreground">SERVIÇOS</h2>

          {barbershop.services.map((service) => (
            <ServiceItem
              key={service.id}
              barbershop={barbershop}
              service={JSON.parse(JSON.stringify(service))}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-b border-solid p-5">
          <h2 className="text-sm font-medium text-foreground">CONTATO</h2>

          {barbershop.phones.map((phone) => (
            <PhoneItem phone={phone} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BarbershopPage;
