import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <>
      {/* <h1>{barbershop.name}</h1> */}

      <Card className="min-w-[160px]">
        <CardContent className="p-0">
          <div className="relative h-[160px] w-full">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              src={barbershop.imageUrl}
              alt={barbershop.name}
            />
          </div>

          <div className="px-2 py-3">
            <h3 className="truncate font-semibold">{barbershop.name}</h3>
            <p className="truncate text-sm text-gray-400">
              {barbershop.address}
            </p>
            <Button variant="secondary" className="mt-3 w-full">
              RESERVAR
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BarbershopItem;
