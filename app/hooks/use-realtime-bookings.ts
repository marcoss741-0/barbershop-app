import { useEffect } from "react";
import { supabase } from "../_lib/supabaseClient";
import { toast } from "sonner";

export const useRealtimeBookings = (barbershopId: string) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "booking",
          filter: `barbershop_id=eq.${barbershopId}`,
        },
        (payload) => {
          console.log("Novo agendamento:", payload.new);
          toast.success("Novo agendamento:", payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [barbershopId]);
};
