import Link from "next/link";

const OwnerPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      <div className="mt-4 space-y-4">
        <Link href="/admin/barbershops">
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            Gerenciar Barbearias
          </button>
        </Link>
        <Link href="/admin/services">
          <button className="rounded bg-green-500 px-4 py-2 text-white">
            Gerenciar Serviços
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OwnerPage;
