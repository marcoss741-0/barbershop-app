import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import { queryAllBookings } from "../_data/query-on-db";
import { auth } from "../_lib/auth-option";
import { redirect } from "next/navigation";


const Bookings = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
    return null;
  }
  const allBookings = await queryAllBookings();

  const confirmedBookings = allBookings.filter(
    (booking) => booking.date >= new Date(),
  );

  const pastBookings = allBookings.filter(
    (booking) => booking.date < new Date(),
  );

  return (
    <>
      <Header />
      {confirmedBookings.length === 0 && pastBookings.length === 0 && (
        <div className="w-full items-center justify-center gap-2 space-y-4 p-5">
          <p className="text-[18px] font-semibold text-foreground">
            Você não tem agendamentos no momento.
          </p>
        </div>
      )}
      {confirmedBookings.length > 0 && (
        <div className="w-full items-center gap-2 space-y-4 p-5">
          <h3 className="text-[16px] font-semibold text-foreground">
            CONFIRMADOS
          </h3>
          {confirmedBookings.map((booking) => (
            <BookingItem 
              key={booking.id} 
              booking={{
                id: booking.id,
                date: booking.date,
                userId: session.user.id,
                barbershopId: booking.barbershop.id,
                barbershopServiceId: booking.service.id,
                barbershop: booking.barbershop,
                barbershopService: booking.service
              }}
            />
          ))}
        </div>
      )}

      {pastBookings.length > 0 && (
        <div className="w-full items-center gap-2 space-y-4 p-5">
          <h3 className="text-[16px] font-semibold text-foreground">
            FINALIZADOS
          </h3>
          {pastBookings.map((pastBooking) => (
            <BookingItem 
              key={pastBooking.id}
              booking={{
                id: pastBooking.id,
                date: pastBooking.date,
                userId: session.user.id,
                barbershopId: pastBooking.barbershop.id,
                barbershopServiceId: pastBooking.service.id,
                barbershop: pastBooking.barbershop,
                barbershopService: pastBooking.service
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Bookings;
