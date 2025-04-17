import { BarbershopService } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { formatCurrencyBRL } from "../helpers/formart-currency";
import { Button } from "./ui/button";

interface BarbershopServicesProps {
  service: BarbershopService;
}

const ServiceItem = ({ service }: BarbershopServicesProps) => {
  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="relative max-h-28 min-h-28 min-w-28 max-w-28">
            <Image
              className="rounded-lg object-cover"
              alt={service.name}
              src={service.imageUrl}
              fill
            />
          </div>
          <div className="flex flex-col gap-1 p-2">
            <h1 className="mb-2 text-sm font-semibold">{service.name}</h1>
            <p className="text-xs text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">
                {formatCurrencyBRL(Number(service.price))}
              </p>
              <Button variant="secondary" size="sm">
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceItem;
