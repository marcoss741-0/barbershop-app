"use client";

interface ResumeBookingsParams {
  name: string;
  quantity: number;
  barbershopId: string;
}

const ResumeBookings = ({
  name,
  quantity,
  barbershopId,
}: ResumeBookingsParams) => {
  return (
    <div>
      A <span className="font-bold text-primary">{name}</span> possui{" "}
      <span className="font-bold">{quantity}</span> agendamentos.
    </div>
  );
};

export default ResumeBookings;
