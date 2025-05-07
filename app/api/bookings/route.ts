import { updateBooking } from "@/app/_actions/update-booking";
import { queryBookings } from "@/app/_data/query-on-db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  const receiveDateFetch = data.get("newDate") as string;

  const bookingId = data.get("bookingId") as string;
  const validDate = new Date(receiveDateFetch);

  try {
    const response = await updateBooking(bookingId, validDate);
    revalidatePath("/");

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao atulizar agendamento:", error.message);

    return NextResponse.json(
      { error: error.message || "Erro ao criar usuário." },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    const response = await queryBookings();
    if (!response) {
      return NextResponse.json({
        successs: false,
        message: "A consulta não retornou nada!",
      });
    }
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Oops, um erro ineseperado aconteceu!",
    });
  }
}
