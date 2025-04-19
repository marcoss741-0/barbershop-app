import { Booking, Prisma } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isConfirmed = isFuture(booking.date);

  return (
    <>
      <Card className="min-w-[90%] space-y-3 rounded-md p-0">
        <CardContent className="flex justify-between">
          <div className="flex flex-col justify-start gap-2 p-4">
            <Badge variant={isConfirmed ? "default" : "secondary"}>
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
            <h3 className="text-[16px] font-bold">{booking.service.name}</h3>

            <div className="flex items-center justify-start gap-2">
              <Avatar>
                <AvatarImage src={booking.service.imageUrl} alt="Avatar" />
                <AvatarFallback>
                  {booking.service.barbershop.name}
                </AvatarFallback>
              </Avatar>
              <p>{booking.service.barbershop.name}</p>
            </div>
          </div>

          <div className="flex min-h-full flex-col items-center justify-center border-l-2 border-solid p-4">
            <p className="text-sm font-normal capitalize">
              {format(booking.date, "MMMM", { locale: ptBR })}
            </p>
            <h3 className="text-2xl font-bold">{format(booking.date, "dd")}</h3>
            <p className="text-sm font-normal">
              {format(booking.date, "HH:mm")}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookingItem;
