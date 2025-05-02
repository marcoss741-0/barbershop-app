"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEffect, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// const availableServices = [
//   { id: "1", name: "Corte de cabelo" },
//   { id: "2", name: "Barba" },
//   { id: "3", name: "Sobrancelha" },
// ];

const formSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string(),
  phones: z.array(z.string().min(1)),
  serviceIds: z.array(z.string().min(1)), // Serviços já existentes
});

type FormValues = z.infer<typeof formSchema>;
type Service = {
  id: string;
  name: string;
  price: Number;
};

export default function CreateBarbershopForm({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void;
}) {
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const fetchServices = async (): Promise<Service[]> => {
    const response = await fetch("/api/services");
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    console.log(fetchServices());

    fetchServices().then(setAvailableServices);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      imageUrl: "",
      description: "",
      phones: [""],
      serviceIds: [],
    },
  });

  const [open, setOpen] = useState(false);
  const selectedServices = watch("serviceIds");

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setValue(
        "serviceIds",
        selectedServices.filter((sid) => sid !== id),
      );
    } else {
      setValue("serviceIds", [...selectedServices, id]);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Cadastrar Barbearia</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Nome" {...register("name")} />
          <Input placeholder="Endereço" {...register("address")} />
          <Input id="imagem" type="file" {...register("imageUrl")} />
          <Textarea placeholder="Descrição" {...register("description")} />
          <Input placeholder="Telefone" {...register("phones.0")} />

          <div>
            <h3 className="mt-6 text-base font-medium">Serviços (Combobox)</h3>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedServices.length > 0
                    ? `Selecionados: ${selectedServices.length}`
                    : "Selecione serviços"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandGroup>
                    {availableServices.map((service) => (
                      <CommandItem
                        key={service.id}
                        onSelect={() => toggleService(service.id)}
                        className="flex items-center"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedServices.includes(service.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {service.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {errors.serviceIds && (
            <p className="text-sm text-red-500">{errors.serviceIds.message}</p>
          )}

          <Button type="submit" className="mt-6 w-full">
            Cadastrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
