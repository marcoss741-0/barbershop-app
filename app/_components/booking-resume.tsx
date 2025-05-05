import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Barbershop, BarbershopService } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { formatCurrencyBRL } from "../helpers/formart-currency";

interface BookingSummaryProps {
  service: Pick<BarbershopService, "name" | "price">;
  barbershop: Pick<Barbershop, "name">;
  selectedDate: Date;
}

const BookingSummary = ({
  service,
  barbershop,
  selectedDate,
}: BookingSummaryProps) => {
  return (
    <Card>
      <CardContent className="space-y-3 p-3 font-medium">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm font-bold">
            {formatCurrencyBRL(Number(service.price))}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-foreground">Data</h2>
          <p className="text-sm">
            {format(selectedDate, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-foreground">Horário</h2>
          <p className="text-sm">{format(selectedDate, "HH:mm")}</p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-foreground">Barbearia</h2>
          <p className="text-sm">{barbershop.name}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
