import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import { queryAllBookings } from "../_data/query-on-db";

const Bookings = async () => {
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
          <p className="text-[18px] font-semibold text-primary-foreground">
            Você não tem agendamentos no momento.
          </p>
        </div>
      )}
      {confirmedBookings.length > 0 && (
        <div className="w-full items-center gap-2 space-y-4 p-5">
          <h3 className="text-[16px] font-semibold text-[#838896]">
            CONFIRMADOS
          </h3>
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {pastBookings.length > 0 && (
        <div className="w-full items-center gap-2 space-y-4 p-5">
          <h3 className="text-[16px] font-semibold text-[#838896]">
            FINALIZADOS
          </h3>
          {pastBookings.map((pastBooking) => (
            <BookingItem key={pastBooking.id} booking={pastBooking} />
          ))}
        </div>
      )}
    </>
  );
};

export default Bookings;
