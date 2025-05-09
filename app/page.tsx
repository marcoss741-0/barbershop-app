import Header from "./_components/header";
import Image from "next/image";
import SearchInput from "./_components/search";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  countBookingsByUserBarbershops,
  queryBarbershopByUser,
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
import BarbershopsContainer from "./_components/barbershops-container";
import BookingsContainer from "./_components/booking-container";
import BookingOnLogin from "./_components/booking-on-login";
import { signIn } from "next-auth/react";

const Home = async () => {
  const session = await auth();

  const userData = (await queryBarbershopByUser(session?.user?.id)) ?? [];
  const countBookingByBarbershopUser = await countBookingsByUserBarbershops(
    session?.user?.id,
  );
  const hasBarbershops = await userHasBarbershop(session?.user?.id);

  const invalidBookings = userData.filter((book) => book.date < new Date());
  const validBookings = userData.filter((book) => book.date >= new Date());

  return (
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
                                  {format(book.date, "HH:mm")}
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
                                className="flex w-full items-center justify-between space-x-2 rounded-md border p-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={book.user.image || "/perfil.png"}
                                  />
                                </Avatar>
                                <div className="flex-1 space-y-1 border-r-2 p-1">
                                  <p className="text-xs font-medium leading-none">
                                    {book.user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {book.barbershopService.name}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center justify-center p-1 text-xs font-semibold capitalize">
                                  <span className="flex flex-col">
                                    {format(book.date, "d", {
                                      locale: ptBR,
                                    })}
                                  </span>
                                  <span className="flex flex-col">
                                    {format(book.date, "MMM", {
                                      locale: ptBR,
                                    })}
                                  </span>
                                  <span>{format(book.date, "HH:mm")}</span>
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

        {session?.user ? (
          <div className="mt-4 w-full items-center gap-2 space-y-4">
            {/* Agendamento do usuario logado */}
            <BookingsContainer />
          </div>
        ) : (
          <Card>
            {/* Opçao para login caso não logado */}
            <BookingOnLogin />
          </Card>
        )}
        <>
          {/* Barbearia disponiveis na plataforma */}
          <BarbershopsContainer />
        </>
      </div>
    </div>
  );
};

export default Home;
