import Header from "@/app/_components/header";
import { Input } from "./_components/ui/input";
import { Button } from "./_components/ui/button";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import db from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { ShortSearchOptions } from "./_constants/short-search";
import BookingItem from "./_components/booking-item";
import SearchInput from "./_components/search";

const Home = async () => {
  const babershops = await db.barbershop.findMany({});
  const popularBarbershop = await db.barbershop.findMany({
    take: 5,
    orderBy: {
      name: "desc",
    },
  });

  return (
    <>
      <div>
        <Header />

        <div className="gap-1 px-5 py-6">
          <h2 className="text-xl font-semibold">
            Olá, <span className="font-bold">Marcos!</span>
          </h2>
          <p className="text-[14px] font-normal">Quinta, 10 de Abril</p>

          <div className="mt-6">
            <SearchInput />
          </div>

          <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {ShortSearchOptions.map((options) => (
              <Button className="cursor-pointer gap-2" variant="secondary">
                <Image
                  src={options.iconUrl}
                  width={16}
                  height={16}
                  alt="corte"
                />
                {options.title}
              </Button>
            ))}
          </div>

          <BookingItem />

          <div className="mt-4 w-full items-center gap-2 space-y-4">
            <h3 className="text-[16px] font-semibold text-[#838896]">
              RECOMENDADOS
            </h3>

            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {babershops.map((babershop) => (
                <BarbershopItem key={babershop.id} barbershop={babershop} />
              ))}
            </div>
          </div>

          <div className="mt-4 w-full items-center gap-2 space-y-4">
            <h3 className="text-[16px] font-semibold text-[#838896]">
              POPULARES
            </h3>

            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {popularBarbershop.map((pop) => (
                <BarbershopItem key={pop.id} barbershop={pop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
