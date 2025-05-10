import { NextResponse } from "next/server";
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

export async function GET() {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: string) => {
    writer.write(encoder.encode(`data: ${data}\n\n`)); // Corrigido aqui
  };

  const handleNewReservation = (reservation: any) => {
    sendEvent(
      JSON.stringify({
        type: "NEW_RESERVATION",
        data: reservation,
      }),
    );
  };

  eventEmitter.on("newReservation", handleNewReservation);

  // Mantém a conexão aberta
  const keepAlive = setInterval(() => {
    sendEvent(JSON.stringify({ type: "KEEP_ALIVE" })); // Corrigido typo aqui também
  }, 30000);

  // Limpeza quando a conexão é fechada
  const cleanup = () => {
    clearInterval(keepAlive);
    eventEmitter.off("newReservation", handleNewReservation);
    writer.close();
  };

  // Detecta quando o cliente fecha a conexão
  const request = this as unknown as { signal?: AbortSignal };
  if (request.signal) {
    request.signal.addEventListener("abort", cleanup);
  }

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

export async function POST(request: Request) {
  const reservation = await request.json();
  eventEmitter.emit("newReservation", reservation);
  return NextResponse.json({ success: true });
}
