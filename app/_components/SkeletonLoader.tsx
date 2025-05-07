const SkeletonLoader = () => {
  return (
    <div className="h-[250px] w-[330px] max-w-sm animate-pulse overflow-hidden rounded-md border border-gray-100 bg-white opacity-40 shadow-sm">
      {/* Espaço do nome da barbearia (h1) */}
      <div className="p-4 pb-2">
        <div className="mb-3 h-6 w-2/3 rounded bg-gray-200 opacity-40"></div>
      </div>

      {/* Espaço do endereço (2 linhas) */}
      <div className="space-y-2 px-4 pb-4">
        <div className="h-4 w-full rounded bg-gray-200 opacity-40"></div>
        <div className="h-4 w-4/5 rounded bg-gray-200 opacity-40"></div>
      </div>

      {/* Botão de reserva (grande e destacado) */}
      <div className="px-4 pb-4">
        <div className="h-10 w-full rounded-md bg-gray-200 opacity-40"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
