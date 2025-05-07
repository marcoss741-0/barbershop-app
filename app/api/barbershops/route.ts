import {
  queryBarbershops,
  queryMostPopularBarber,
} from "@/app/_data/query-on-db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const queryType = searchParams.get("pop");

  if (queryType === "popular") {
    try {
      const response = await queryMostPopularBarber();
      if (!response) {
        return NextResponse.json({
          success: false,
          message: "A Consulta não retornou nada",
        });
      }
      return NextResponse.json(response);
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Ocoreu um erro ao localizar dos dados!",
      });
    }
  }

  try {
    const response = await queryBarbershops();
    if (!response) {
      return NextResponse.json({
        success: false,
        message: "A Consulta não retornou nada",
      });
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Ocoreu um erro ao localizar dos dados!",
    });
  }
}
