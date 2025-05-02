import { availableServices } from "@/app/_data/query-on-db";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await availableServices();

  return NextResponse.json(services);
}
