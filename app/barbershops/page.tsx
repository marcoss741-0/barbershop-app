import BarbershopItem from "../_components/barbershop-item";
import Header from "../_components/header";
import SearchInput from "../_components/search";
import db from "../_lib/prisma";

interface BarbershopsPageProps {
  searchParams: {
    title?: string;
    service?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        searchParams.title
          ? {
              name: {
                contains: searchParams.title,
                mode: "insensitive",
              },
            }
          : {},
        searchParams.service
          ? {
              services: {
                some: {
                  name: {
                    contains: searchParams.service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  });
  return (
    <>
      <div>
        <Header />
        <div className="my-6 px-5">
          <SearchInput />
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
