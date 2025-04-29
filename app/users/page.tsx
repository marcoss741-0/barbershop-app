"use client";

import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import Header from "../_components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/ui/form";

const schema = z.object({
  name: z.string().trim().min(2, {
    message: "Digite o nome completo",
  }),
  email: z.string().email({
    message: "Email inválido!",
  }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    .max(32, { message: "A senha deve ter no máximo 32 caracteres" }),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Faça, upload da sua foto",
  }),
});

type FormData = z.infer<typeof schema>;

const RegisterForm2 = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      file: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormData) => {
    // console.log(data);
    const { name, email, password, file } = data;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("file", file);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: formData,
        // body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao criar usuário";
        try {
          const errorData = await response.json(); // Tenta processar o JSON
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.warn("Resposta da API não contém JSON válido.");
        }
        throw new Error(errorMessage);
      }

      toast.success("Usuário criado com sucesso!");
      form.reset({
        email: "",
        password: "",
        name: "",
        file: undefined,
      });
    } catch (err) {
      console.error("Erro na requisição:", err.message);
      toast.error(
        err.message || "Erro ao criar usuário, tente novamente mais tarde.",
      );
    }
  };

  return (
    <>
      <Header />
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Registre-se</CardTitle>
              <CardDescription>
                Crie uma conta para acessar todos os serviços.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Digite seu nome"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="min-h-[1.25rem] transition-all duration-200" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="m@exemplo.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="min-h-[1.25rem] transition-all duration-200" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage className="min-h-[1.25rem] transition-all duration-200" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid items-center justify-center gap-2">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foto de perfil</FormLabel>
                            <FormControl>
                              <input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                                ref={field.ref}
                                name={field.name}
                                disabled={field.disabled}
                                className="w-full rounded-lg border border-solid p-3 text-xs"
                              />
                            </FormControl>
                            <FormMessage className="min-h-[1.25rem] transition-all duration-200" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Image
                            src="/loading2.svg"
                            width={18}
                            height={18}
                            alt="loading"
                          />
                          Registrando
                        </>
                      ) : (
                        "Registrar"
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Já Possui conta?{" "}
                    <Link href="/" className="underline underline-offset-4">
                      Fazer Login
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterForm2;
