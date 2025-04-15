import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

const BookingItem = () => {
  return (
    <>
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
              <Badge className="bg-[#221C3D] text-[#8162FF]">Confirmado</Badge>
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
    </>
  );
};

export default BookingItem;
