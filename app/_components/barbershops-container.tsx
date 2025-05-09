"use client";

import { useEffect, useState } from "react";
import BarbershopItem from "./barbershop-item";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";

const BarbershopsContainer = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [popBarbershops, setPopBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarbershops() {
      try {
        setLoading(true);
        const response = await fetch("/api/barbershops", { method: "GET" });
        if (!response.ok) {
          return {
            success: false,
            message: "Não foi possível obter os dados!",
          };
        }
        setBarbershops(await response.json());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPopBarbershops() {
      try {
        const response = await fetch("/api/barbershops?pop=popular", {
          method: "GET",
        });
        if (!response.ok) {
          return {
            success: false,
            message: "Não foi possível obter os dados!",
          };
        }
        setPopBarbershops(await response.json());
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(() => {
      fetchBarbershops();
      fetchPopBarbershops();
    }, 4000);
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {Array.isArray(barbershops) && barbershops.length > 0 && (
            <>
              <div className="mt-4 w-full items-center gap-2 space-y-4">
                <h3 className="text-[16px] font-semibold text-foreground">
                  RECOMENDADOS
                </h3>

                <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {barbershops.map((babershop) => (
                    <BarbershopItem key={babershop.id} barbershop={babershop} />
                  ))}
                </div>
              </div>

              {popBarbershops && popBarbershops.length > 0 && (
                <div className="mt-4 w-full items-center gap-2 space-y-4">
                  <h3 className="text-[16px] font-semibold text-foreground">
                    POPULARES
                  </h3>

                  <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {popBarbershops.map((pop) => (
                      <BarbershopItem key={pop.id} barbershop={pop} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {(!Array.isArray(barbershops) ||
            (Array.isArray(barbershops) && barbershops.length === 0)) && (
            <div className="flex items-center justify-center rounded-md p-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Ooops, Galera!</AlertTitle>
                <AlertDescription>
                  A Plataforma esta em{" "}
                  <span className="font-semibold text-primary">Beta</span> e
                  ainda não temos associados, logo, logo estará tudo pronto!!
                </AlertDescription>
              </Alert>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BarbershopsContainer;
