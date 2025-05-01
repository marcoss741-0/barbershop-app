import Header from "./_components/header";
import Image from "next/image";
import BarbershopItem from "./_components/barbershop-item";
import BookingItem from "./_components/booking-item";
import SearchInput from "./_components/search";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  countBookingsByUserBarbershops,
  queryBarbershopByUser,
  queryBarbershops,
  queryBookings,
  queryMostPopularBarber,
} from "./_data/query-on-db";
import FastSearch from "./_components/fast-search-buttons";
import { auth } from "./_lib/auth-option";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./_components/ui/card";
import { BellRing, Check } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "./_components/ui/switch";

const Home = async () => {
  const session = await auth();

  const babershops = await queryBarbershops();
  const popularBarbershop = await queryMostPopularBarber();
  const bookings = await queryBookings();
  const userData = await queryBarbershopByUser(session?.user?.id);
  const countBookingByBarbershopUser = await countBookingsByUserBarbershops(
    session?.user?.id,
  );

  return (
    <>
      <div>
        <Header />

        <div className="gap-1 px-5 py-6">
          <h2 className="text-xl font-medium text-foreground">
            Olá,{" "}
            <span className="font-medium capitalize text-primary">
              {session?.user?.name
                ? `${session.user.name.split(" ")[0]}`
                : "Bem vindos!"}
            </span>
          </h2>
          <p className="text-[14px] font-semibold capitalize text-secondary-foreground">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>

          <div className="mt-6">
            <SearchInput />
          </div>
          {
            <>
              <FastSearch />
            </>
          }
          <div className="relative mt-6 flex h-40 w-full items-center rounded-md lg:h-80">
            <Image
              fill
              priority
              src="/barbershop team-pana.svg"
              alt="Corte como os melhores da cidade!"
              className="rounded-md object-cover object-top lg:object-contain lg:object-top"
            />
          </div>

          {session?.user && (
            <>
              <div className="mt-4 w-full items-center gap-2 space-y-4">
                <h3 className="text-[16px] font-semibold text-foreground">
                  DASBOARD
                </h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      AGENDAMENTOS
                    </CardTitle>
                    <CardDescription className="text-[16px] text-foreground">
                      Sua Barbearia possui{" "}
                      <span className="font-bold">
                        {countBookingByBarbershopUser}
                      </span>{" "}
                      agendamentos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="space-y-4">
                      {userData.map((book) => (
                        <div className="flex items-center space-x-4 rounded-md border p-4">
                          <BellRing />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {book.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {book.service.name}
                            </p>
                          </div>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Check /> Mark all as read
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}

          {session?.user && (
            <div className="mt-4 w-full items-center gap-2 space-y-4">
              <h3 className="text-[16px] font-semibold text-foreground">
                AGENDAMENTOS
              </h3>
              <div className="flex min-w-full gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {bookings.length > 0 ? (
                  bookings.map(
                    (
                      booking: Prisma.BookingGetPayload<{
                        include: {
                          service: { include: { barbershop: true } };
                        };
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
                    <p className="text-sm font-medium text-secondary-foreground">
                      Você não tem agendamentos
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 w-full items-center gap-2 space-y-4">
            <h3 className="text-[16px] font-semibold text-foreground">
              RECOMENDADOS
            </h3>

            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {babershops.map((babershop) => (
                <BarbershopItem key={babershop.id} barbershop={babershop} />
              ))}
            </div>
          </div>

          <div className="mt-4 w-full items-center gap-2 space-y-4">
            <h3 className="text-[16px] font-semibold text-foreground">
              POPULARES
            </h3>

            <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {popularBarbershop.map((pop) => (
                <BarbershopItem key={pop.id} barbershop={pop} />
              ))}
            </div>
          </div>

          {/* stay here */}
        </div>
      </div>
    </>
  );
};

export default Home;
