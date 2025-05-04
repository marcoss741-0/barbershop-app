"use client";

import React from "react";
import { Service } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { NumericFormat } from "react-number-format";

export const barbershopServiceFormSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço padrão.").optional(),
  name: z.string().min(3, "Nome muito curto."),
  description: z.string().min(5, "Descrição muito curta."),
  price: z.coerce
    .number({
      invalid_type_error: "Preço deve ser um número.",
    })
    .positive("Preço deve ser positivo."),
  imageUrl: z
    .string()
    .url("URL da imagem inválida.")
    .or(z.literal(""))
    .optional(),
});

export type BarbershopServiceFormData = z.infer<
  typeof barbershopServiceFormSchema
>;

interface ServiceFormProps {
  isEditMode?: boolean;
  standardServices: Pick<Service, "id" | "name">[];
  form: UseFormReturn<BarbershopServiceFormData>;
}

export const ServiceForm = ({
  isEditMode = false,
  standardServices,
  form,
}: ServiceFormProps) => {
  return (
    <Form {...form}>
      <div className="space-y-4 px-4">
        {!isEditMode && (
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviços Base</FormLabel>
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
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o serviço (ex: Corte, Barba).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Exibição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte Degradê" {...field} />
              </FormControl>
              <FormDescription>
                Como este serviço aparecerá para os clientes desta barbearia.
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhes do serviço nesta barbearia..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  prefix="R$ "
                  allowNegative={false}
                  customInput={Input}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  {...field}
                  onChange={() => {}}
                />
                {/* <Input type="number" step="0.01" placeholder="50.00" /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};
