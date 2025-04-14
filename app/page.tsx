import Header from "@/app/_components/header";
import { Input } from "./_components/ui/input";
import { Button } from "./_components/ui/button";
import {
  EyeIcon,
  FootprintsIcon,
  ScissorsIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "./_components/ui/card";
import { Badge } from "./_components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./_components/ui/avatar";
import db from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";

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

          <div className="mt-6 flex items-center gap-2">
            <Input type="text" placeholder="Buscar..." className="w-full" />
            <Button
              variant="default"
              className="cursor-pointer rounded-md bg-[#8162FF] text-white"
            >
              <SearchIcon />
            </Button>
          </div>

          <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            <Button className="gap-2" variant="secondary">
              <Image src="/corte.svg" width={16} height={16} alt="corte" />
              Cabelo
            </Button>

            <Button className="gap-2" variant="secondary">
              <Image src="/barba.svg" width={16} height={16} alt="barba" />
              Cabelo
            </Button>

            <Button className="gap-2" variant="secondary">
              <Image
                src="/acabamento.svg"
                width={16}
                height={16}
                alt="acabamento"
              />
              Cabelo
            </Button>

            <Button className="gap-2" variant="secondary">
              <Image
                src="/sobrancelha.svg"
                width={16}
                height={16}
                alt="acabamento"
              />
              Sobrancelhas
            </Button>

            <Button className="gap-2" variant="secondary">
              <FootprintsIcon size={16} />
              Pezinho
            </Button>
          </div>

          <div className="relative mt-6 flex h-36 w-full items-center rounded-md">
            <Image
              fill
              priority
              src="/banner.png"
              alt="Corte como os melhores da cidade!"
              className="rounded-md object-cover"
            />
          </div>
          <div className="mt-4 w-full items-center gap-2 space-y-4">
            <h3 className="text-[16px] font-semibold text-[#838896]">
              AGENDAMENTOS
            </h3>
            <Card className="w-full space-y-3 rounded-md p-0">
              <CardContent className="flex justify-between">
                <div className="flex flex-col justify-start gap-2 p-4">
                  <Badge className="bg-[#221C3D] text-[#8162FF]">
                    Confirmado
                  </Badge>
                  <h3 className="text-[16px] font-bold">Corte de Cabelo</h3>

                  <div className="flex items-center justify-start gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png"
                        alt="Avatar"
                      />
                      <AvatarFallback>BV</AvatarFallback>
                    </Avatar>
                    <p>ÔMEGA BARBER</p>
                  </div>
                </div>

                <div className="flex min-h-full flex-col items-center justify-center border-l-2 border-solid p-4">
                  <p className="text-sm font-normal">Abril</p>
                  <h3 className="text-2xl font-bold">10</h3>
                  <p className="text-sm font-normal">10:30</p>
                </div>
              </CardContent>
            </Card>
          </div>

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
        <footer>
          <Card>
            <CardContent>
              <p>
                {" "}
                &copy; 2025 Copyright.{" "}
                <span className="font-bold">Ômega Barbers.</span>
              </p>
            </CardContent>
          </Card>
        </footer>
      </div>
    </>
  );
};

export default Home;
