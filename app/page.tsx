import Header from "./_components/header";
import Image from "next/image";
import BarbershopItem from "./_components/barbershop-item";
import BookingItem from "./_components/booking-item";
import SearchInput from "./_components/search";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  countBookingsByUserBarbershops,
  queryBarbershopByUser,
  queryBarbershops,
  queryBookings,
  queryMostPopularBarber,
  userHasBarbershop,
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
import { Check, Cog, Terminal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Switch } from "./_components/ui/switch";
import RegisterBarbershops from "./_components/sheet-register-barbershops";
import { Sheet, SheetContent, SheetTrigger } from "./_components/ui/sheet";
import { Avatar, AvatarImage } from "./_components/ui/avatar";
import { DatePicker } from "./_components/update-date-booking";
import { Popover, PopoverContent } from "./_components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./_components/ui/alert";

const Home = async () => {
  const session = await auth();

  const babershops = await queryBarbershops();
  const popularBarbershop = await queryMostPopularBarber();
  const bookings = await queryBookings();
  const userData = (await queryBarbershopByUser(session?.user?.id)) ?? [];
  const countBookingByBarbershopUser = await countBookingsByUserBarbershops(
    session?.user?.id,
  );
  const hasBarbershops = await userHasBarbershop(session?.user?.id);

  const invalidBookings = userData.filter((book) => book.date < new Date());
  const validBookings = userData.filter((book) => book.date >= new Date());

  return (
    <>
      <div>
        <Header />

        <div className="space-y-4 px-5 py-6">
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
          {<FastSearch />}
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
                  DASHBOARD
                </h3>
                {!hasBarbershops ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          Cadastre sua barbearia
                        </CardTitle>
                        <CardDescription className="text-sm text-foreground">
                          Possui, uma{" "}
                          <span className="font-bold text-primary">
                            barbearia?
                          </span>
                          . Você pode oferecer seus serviços pela nossa
                          plataforma.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button className="w-full cursor-pointer p-3 text-lg font-medium">
                              Começar
                            </Button>
                          </SheetTrigger>
                          <SheetContent
                            side="left"
                            className="w-[90%] overflow-y-auto"
                          >
                            <RegisterBarbershops />
                          </SheetContent>
                        </Sheet>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="intems-center flex justify-between text-lg font-semibold">
                          Clientes Agendados
                          <Popover>
                            <PopoverTrigger>
                              <Cog />
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-col items-center justify-center">
                                <h1 className="text-lg font-normal">
                                  Gerenciar sua barbearia
                                </h1>

                                <Link
                                  className="text-primary hover:scale-[110%] hover:transition-all"
                                  href={`/admin/barbershops/${hasBarbershops.id}`}
                                >
                                  Vá Para o painel
                                </Link>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </CardTitle>
                        <CardDescription className="text-[16px] text-foreground">
                          A sua{" "}
                          <span className="font-bold text-primary">
                            {hasBarbershops.name}
                          </span>{" "}
                          possui{" "}
                          <span className="font-bold">
                            {countBookingByBarbershopUser}
                          </span>{" "}
                          agendamentos.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex max-h-[250px] flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-4">
                          {validBookings.map((book) => (
                            <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                              <Avatar>
                                <AvatarImage
                                  src={book.user.image || "/perfil.png"}
                                />
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {book.user.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {book.barbershopService.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs">
                                  {format(book.date, "d 'de' MMMM", {
                                    locale: ptBR,
                                  })}
                                  <span className="block">
                                    {format(book.date, "HH:mm", {
                                      locale: ptBR,
                                    })}
                                  </span>
                                </p>
                              </div>
                              <Switch />
                            </div>
                          ))}

                          {invalidBookings.length > 0 && (
                            <>
                              <div className="flex items-center gap-2">
                                <Terminal className="h-4 w-4" />
                                Atenção!{" "}
                                <span className="text-[14px] text-primary">
                                  Agendamentos expirados!
                                </span>
                              </div>
                              {invalidBookings.map((book) => (
                                <div
                                  key={book.id}
                                  className="flex w-full items-center justify-between space-x-4 rounded-md border p-4"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={book.user.image || "/perfil.png"}
                                    />
                                  </Avatar>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                      {book.user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {book.barbershopService.name}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center justify-center text-xs font-semibold capitalize">
                                    <p className="flex flex-col">
                                      {format(book.date, "d MMM", {
                                        locale: ptBR,
                                      })}
                                      <span>{format(book.date, "HH:mm")}</span>
                                    </p>
                                  </div>
                                  <DatePicker
                                    bookingId={book.id}
                                    serviceId={book.barbershopService.id}
                                  />
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Check /> Receber Notificação de todas
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                )}
              </div>
            </>
          )}

          {session?.user && babershops.length > 0 ? (
            <div className="mt-4 w-full items-center gap-2 space-y-4">
              <h3 className="text-[16px] font-semibold text-foreground">
                AGENDAMENTOS
              </h3>
              <div className="flex min-w-full gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={{
                        id: booking.id,
                        userId: booking.userId,
                        date: booking.date,
                        barbershopId: booking.barbershopId,
                        barbershopServiceId: booking.barbershopServiceId,
                        barbershop: booking.barbershop,
                        barbershopService: booking.barbershopService,
                      }}
                    />
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center">
                    <p className="text-sm font-medium text-secondary-foreground">
                      Você não tem agendamentos
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {babershops && babershops.length > 0 ? (
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
          ) : (
            <></>
          )}

          {popularBarbershop && popularBarbershop.length > 0 ? (
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
          ) : (
            <>
              <div className="flex items-center justify-center rounded-md p-4">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Ooops, Galera!</AlertTitle>
                  <AlertDescription>
                    A Plataforma esta em{" "}
                    <span className="font-semibold text-primary">Beta</span> e
                    ainda não temos associados, logo, logo estará tudo pronto!!
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
