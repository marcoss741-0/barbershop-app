import Link from "next/link";
import { ShortSearchOptions } from "../_constants/short-search";
import { Button } from "./ui/button";
import Image from "next/image";
const FastSearch = () => {
  return (
    <>
      <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {ShortSearchOptions.map((options) => (
          <Link
            href={`/barbershops?service=${options.title}`}
            className="w-full"
          >
            <Button className="cursor-pointer gap-2" variant="secondary">
              <Image src={options.iconUrl} width={16} height={16} alt="corte" />
              {options.title}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default FastSearch;
