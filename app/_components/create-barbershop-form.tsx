"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../_components/ui/button"; // Ajuste o caminho
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form"; // Ajuste o caminho
import { Input } from "../_components/ui/input"; // Ajuste o caminho
import { Textarea } from "../_components/ui/textarea"; // Ajuste o caminho
import { toast } from "sonner";
import { createBarbershopWithServices } from "../_actions/create-barbershop-with-services"; // Ajuste o caminho
import { useState } from "react";
import { Service } from "@prisma/client"; // Importe o tipo Service
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../_components/ui/select"; // Ajuste o caminho

// --- Zod Schema para Validação --- (Deve espelhar as interfaces da Server Action)

const serviceDetailSchema = z.object({
  serviceName: z.string().min(1, "Selecione um serviço padrão."),
  displayName: z.string().optional(), // Nome customizado (opcional)
  description: z.string().min(5, "Descrição muito curta."),
  price: z.coerce // Converte string para número
    .number({
      invalid_type_error: "Preço deve ser um número.",
    })
    .positive("Preço deve ser positivo."),
  imageUrl: z.string().url("URL da imagem inválida."),
});

const barbershopFormSchema = z.object({
  barbershopData: z.object({
    name: z.string().min(3, "Nome muito curto."),
    address: z.string().min(10, "Endereço muito curto."),
    // Validar array de telefones pode ser mais complexo, simplificando aqui
    phones: z.string().min(8, "Telefone inválido"), // Coletar como string separada por vírgula, por exemplo
    description: z.string().min(10, "Descrição muito curta."),
    imageUrl: z.string().url("URL da imagem inválida."),
  }),
  serviceDetails: z
    .array(serviceDetailSchema)
    .min(1, "Adicione pelo menos um serviço."),
});

type BarbershopFormData = z.infer<typeof barbershopFormSchema>;

// --- Componente do Formulário ---

export interface CreateBarbershopFormProps {
  standardServices: Pick<Service, "id" | "name">[]; // Receber lista de serviços padrão
}

export function CreateBarbershopForm({
  standardServices,
}: CreateBarbershopFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BarbershopFormData>({
    resolver: zodResolver(barbershopFormSchema),
    defaultValues: {
      barbershopData: {
        name: "",
        address: "",
        phones: "", // Inicializar como string vazia
        description: "",
        imageUrl: "",
      },
      serviceDetails: [],
    },
  });

  // Hook para gerenciar o array dinâmico de serviços
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serviceDetails",
  });

  const onSubmit = async (data: BarbershopFormData) => {
    setIsLoading(true);
    try {
      // Transformar a string de telefones em array
      const phonesArray = data.barbershopData.phones
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone.length > 0);

      const { name, address, description, imageUrl } = data.barbershopData;

      const result = await createBarbershopWithServices({
        barbershopData: {
          name,
          address,
          description,
          imageUrl,
          phones: phonesArray,
        },
        serviceDetails: data.serviceDetails.map(service => ({
          serviceName: service.serviceName || '',
          displayName: service.displayName || '',
          description: service.description || '',
          price: service.price || 0,
          imageUrl: service.imageUrl || ''
        })),
      });

      if (result.success) {
        toast.success("Barbearia criada com sucesso!");
        form.reset(); // Limpar o formulário
      } else {
        toast.error(`Erro: ${result.error}`);
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
        {/* --- Campos da Barbearia --- */}
        <h2 className="text-xl font-semibold">Dados da Barbearia</h2>
        <FormField
          control={form.control}
          name="barbershopData.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Barbearia</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Barbearia do Zé" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barbershopData.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua Exemplo, 123 - Bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barbershopData.phones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefones</FormLabel>
              <FormControl>
                <Input
                  placeholder="(11) 99999-9999, (11) 8888-8888"
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
          name="barbershopData.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Barbearia</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva a barbearia..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barbershopData.imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem Principal</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Campos dos Serviços Vinculados (Dinâmico) --- */}
        <h2 className="text-xl font-semibold">Serviços Oferecidos</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded border p-4">
            <h3 className="font-medium">Serviço #{index + 1}</h3>
            <FormField
              control={form.control}
              name={`serviceDetails.${index}.serviceName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço Padrão</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço base" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {standardServices.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDetails.${index}.displayName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Exibição (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Corte Master (se diferente do padrão)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Deixe em branco para usar o nome padrão.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDetails.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Específica</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva como este serviço é feito aqui..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDetails.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="50.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`serviceDetails.${index}.imageUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem do Serviço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/servico.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              Remover Serviço
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              serviceName: "",
              description: "",
              price: 0,
              imageUrl: "",
            })
          }
        >
          Adicionar Serviço
        </Button>
        <FormMessage>
          {form.formState.errors.serviceDetails?.message}
        </FormMessage>

        {/* --- Botão de Submissão --- */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Criar Barbearia"}
        </Button>
      </form>
    </Form>
  );
}
