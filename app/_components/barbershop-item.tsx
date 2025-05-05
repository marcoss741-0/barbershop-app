"use client";

import { Barbershop } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const [imgSrc, setImgSrc] = useState(barbershop.imageUrl);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    fetch(`/api/rating/get-rating?id=${barbershop.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro na resposta da API");
        }
        return res.json();
      })
      .then(setRating)
      .catch(() => setRating(null)); // ou trate o erro como preferir
  }, [barbershop.id]);

  return (
    <>
      <Card className="min-w-[160px]">
        <CardContent className="p-0 px-1 pt-1">
          <div className="relative h-[160px] w-full">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-2xl object-cover"
              src={
                imgSrc && imgSrc.trim() !== ""
                  ? imgSrc
                  : "https://res.cloudinary.com/dz84imb8z/image/upload/v1746268642/barbershop_images/wbqrlbecp5k74wqais0p.png"
              }
              alt={barbershop.name}
              onError={() =>
                setImgSrc(
                  "https://res.cloudinary.com/dz84imb8z/image/upload/v1746268642/barbershop_images/wbqrlbecp5k74wqais0p.png",
                )
              }
            />

            <Badge
              className="absolute left-2 top-2 space-x-1"
              variant="default"
            >
              <Star size={12} className="fill-black text-black" />
              {rating !== null && rating !== undefined ? (
                <p>{rating.average.toFixed(2)}</p>
              ) : (
                <p>
                  <Image
                    src="/loading2.svg"
                    width={20}
                    height={20}
                    alt="Loadin Rating"
                  />
                </p>
              )}
            </Badge>
          </div>

          <div className="px-1 py-3">
            <h3 className="truncate font-semibold">{barbershop.name}</h3>
            <p className="truncate text-sm font-medium text-card-foreground">
              {barbershop.address}
            </p>
            <Button
              variant="outline"
              className="mt-3 w-full cursor-pointer"
              asChild
            >
              <Link href={`/barbershops/${barbershop.id}`}>RESERVAR</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BarbershopItem;
