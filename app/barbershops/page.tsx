import { Button } from "../_components/ui/button";
import BarbershopItem from "../_components/barbershop-item";
import Header from "../_components/header";
import SearchInput from "../_components/search";
import { ShortSearchOptions } from "../_constants/short-search";
import { queryBarbershopServiceByName } from "../_data/query-on-db";
import Image from "next/image";
import Link from "next/link";
import FastSearch from "../_components/fast-search-buttons";

interface BarbershopsPageProps {
  searchParams: {
    title?: string;
    service?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await queryBarbershopServiceByName(
    searchParams.service ?? "",
    searchParams.title ?? "",
  );
  return (
    <>
      <div>
        <Header />
        <div className="my-6 px-5">
          <SearchInput />
        </div>
        <div className="px-5">
          <FastSearch />
        </div>
        <div className="px-5">
          <h3 className="mb-3 mt-6 text-[16px] font-semibold uppercase text-[#838896]">
            Resultados Para &quot;{searchParams.title || searchParams.service}
            &quot;
          </h3>

          <div className="mb-3 grid grid-cols-2 gap-4">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarbershopsPage;
