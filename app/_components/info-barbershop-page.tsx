"use client";

import { Barbershop } from "@prisma/client";
import { MapPinIcon, StarIcon } from "lucide-react";
import RatingStar from "./star-raing";
import { setRating } from "@/app/_actions/set-rating";
import { toast } from "sonner";

interface InfoBarberPageParams {
  barbershop: Barbershop;
  avg: string;
  count: string;
}

const InfoBarberPage = ({ barbershop, avg, count }: InfoBarberPageParams) => {
  const handleRating = async (value: number) => {
    try {
      const result = await setRating(barbershop.id, value);

      if (result.success == false) {
        toast.success(result.message);
      }

      toast.success(result.message);

      return result;
    } catch (error) {
      console.error("Erro ao avaliar:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-5">
        <h1 className="mt-2 text-xl font-bold">{barbershop.name}</h1>

        <div className="flex items-center gap-1">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>

        <div className="items-cemter flex w-full justify-between gap-2">
          <div className="mt-5 flex items-center gap-1">
            <StarIcon size={18} className="fill-primary text-primary" />
            <p className="text-sm">
              {avg} ({count} avaliações)
            </p>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-foreground">Avaliar barbearia?</p>
              <RatingStar onRating={handleRating} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoBarberPage;
