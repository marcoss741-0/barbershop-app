import Header from "@/app/_components/header";
import { Button } from "./_components/ui/button";
import Image from "next/image";
import db from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { ShortSearchOptions } from "./_constants/short-search";
import BookingItem from "./_components/booking-item";
import SearchInput from "./_components/search";
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth-option";
import { Prisma } from "@prisma/client";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const babershops = await db.barbershop.findMany({});
  const popularBarbershop = await db.barbershop.findMany({
    take: 5,
    orderBy: {
      name: "desc",
    },
  });

  const bookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: (session?.user as { id: string })?.id,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      })
    : [];

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
            <div className="flex min-w-full gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {bookings.length > 0 ? (
                bookings.map(
                  (
                    booking: Prisma.BookingGetPayload<{
                      include: { service: { include: { barbershop: true } } };
                    }>,
                  ) => (
                    <BookingItem
                      key={JSON.parse(JSON.stringify(booking.id))}
                      booking={JSON.parse(JSON.stringify(booking))}
                    />
                  ),
                )
              ) : (
                <div className="flex w-full items-center justify-center">
                  <p className="text-sm text-gray-400">
                    Você não tem agendamentos
                  </p>
                </div>
              )}
            </div>
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
      </div>
    </>
  );
};

export default Home;
