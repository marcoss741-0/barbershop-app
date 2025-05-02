import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ptBR } from "date-fns/locale";
import { Badge } from "./ui/badge";
import { format, isFuture } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Prisma } from "@prisma/client";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: { barbershopService: true; barbershop: true };
  }>;
}

const BookingSummary = ({ booking }: BookingItemProps) => {
  const isConfirmed = isFuture(booking.date);
  return (
    <Card className="min-w-full rounded-md border p-0 font-medium text-foreground">
      <CardContent className="flex w-full items-center justify-between gap-3 p-0">
        <div className="flex flex-col justify-start gap-2 p-4">
          <Badge
            className="w-fit text-xs"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>
          <h3 className="text-nowrap text-[16px] font-bold">
            {booking.barbershopService.name}
          </h3>

          <div className="flex items-center justify-start gap-2">
            <Avatar>
              <AvatarImage
                width={32}
                height={32}
                src={booking.barbershopService.imageUrl}
                alt="Avatar"
              />
            </Avatar>
            <p className="text-nowrap text-sm">
              {booking.barbershop.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start border-l-2 border-solid p-4">
          <p className="text-sm font-normal capitalize">
            {format(booking.date, "MMMM", { locale: ptBR })}
          </p>
          <h3 className="text-2xl font-bold">{format(booking.date, "dd")}</h3>
          <p className="text-sm font-normal">{format(booking.date, "HH:mm")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
