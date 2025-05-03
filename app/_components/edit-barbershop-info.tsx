"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/_components/ui/button"; // Ajuste o caminho
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form"; // Ajuste o caminho
import { Input } from "@/app/_components/ui/input"; // Ajuste o caminho
import { Textarea } from "@/app/_components/ui/textarea"; // Ajuste o caminho
import { toast } from "sonner";
import { updateBarbershopInfo } from "@/app/_actions/update-barbershop-info"; // Ajuste o caminho
import { useState } from "react";
import { Barbershop } from "@prisma/client"; // Importar o tipo Barbershop
import Image from "next/image";

// --- Zod Schema para Validação da Edição ---
// Similar ao de criação, mas pode ter ajustes se necessário
const editBarbershopInfoSchema = z.object({
  name: z.string().min(3, "Nome muito curto."),
  address: z.string().min(10, "Endereço muito curto."),
  phones: z.string().min(8, "Telefone inválido"), // Coletar como string
  description: z.string().min(10, "Descrição muito curta."),
});

type EditBarbershopInfoFormData = z.infer<typeof editBarbershopInfoSchema>;

// --- Props do Componente ---
interface EditBarbershopInfoFormProps {
  barbershop: Pick<
    Barbershop,
    "id" | "name" | "address" | "phones" | "description"
  >;
}

// --- Componente do Formulário de Edição ---
export function EditBarbershopInfoForm({
  barbershop,
}: EditBarbershopInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditBarbershopInfoFormData>({
    resolver: zodResolver(editBarbershopInfoSchema),
    // Pré-popular o formulário com os dados atuais da barbearia
    defaultValues: {
      name: barbershop.name,
      address: barbershop.address,
      phones: barbershop.phones.join(", "), // Converter array para string para o input
      description: barbershop.description,
    },
  });

  const onSubmit = async (data: EditBarbershopInfoFormData) => {
    setIsLoading(true);
    try {
      // Transformar a string de telefones em array
      const phonesArray = data.phones
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone.length > 0);

      const result = await updateBarbershopInfo({
        barbershopId: barbershop.id,
        name: data.name,
        address: data.address,
        description: data.description,
        phones: phonesArray,
      });

      if (result.success) {
        toast.success("Informações da barbearia atualizadas com sucesso!");
        // Opcional: resetar o formulário para os novos valores (se a página não recarregar)
        // form.reset(data); // Reset com os dados enviados
      } else {
        toast.error(
          `Erro: ${result.error || "Não foi possível atualizar as informações."}`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Barbearia</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Image
              src="/loading2.svg"
              width={18}
              height={18}
              alt="Loading..."
            />
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </Form>
  );
}
