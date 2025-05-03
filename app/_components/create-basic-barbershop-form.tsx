"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Textarea } from "../_components/ui/textarea";
import { toast } from "sonner";
import { createBasicBarbershop } from "../_actions/create-basic-barbershop";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const basicBarbershopFormSchema = z.object({
  name: z.string().min(3, "Nome muito curto."),
  address: z.string().min(10, "Endereço muito curto."),

  phones: z.string().min(8, "Telefone inválido"),
  description: z.string().min(10, "Descrição muito curta."),
});

type BasicBarbershopFormData = z.infer<typeof basicBarbershopFormSchema>;

export function CreateBasicBarbershopForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Hook para redirecionamento

  const form = useForm<BasicBarbershopFormData>({
    resolver: zodResolver(basicBarbershopFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phones: "",
      description: "",
    },
  });

  const onSubmit = async (data: BasicBarbershopFormData) => {
    setIsLoading(true);
    try {
      // Transformar a string de telefones em array
      const phonesArray = data.phones
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone.length > 0);

      // Correção:
      const dataToSend = {
        name: data.name,
        address: data.address,
        description: data.description,
        phones: phonesArray,
        // imageUrl é opcional na definição da action, então não precisamos enviar
      };

      const result = await createBasicBarbershop(dataToSend);

      if (result.success && result.barbershopId) {
        toast.success(
          "Barbearia criada com sucesso! Redirecionando para o painel...",
        );
        // Redirecionar para a página de gerenciamento da nova barbearia
        // Ajuste a rota conforme sua estrutura (ex: /admin/barbershops/[id])
        router.push(`/admin/barbershops/${result.barbershopId}`);
      } else {
        toast.error(
          `Erro: ${result.error || "Não foi possível criar a barbearia."}`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado no formulário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Barbearia</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Barbearia Estilo Único" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Avenida Principal, 456 - Centro"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefones</FormLabel>
              <FormControl>
                <Input
                  placeholder="(21) 98888-7777, (21) 2345-6789"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Separe múltiplos telefones por vírgula.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Barbearia</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente a barbearia..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Image
              src="/loading2.svg"
              width={18}
              height={18}
              alt="Loading..."
            />
          ) : (
            "Criar Barbearia e Continuar"
          )}
        </Button>
      </form>
    </Form>
  );
}
