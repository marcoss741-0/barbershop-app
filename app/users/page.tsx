"use client";

import { Label } from "../_components/ui/label";
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
import React, { useRef, useState } from "react";
import Image from "next/image";

const RegisterForm = () => {
  // Refs para os campos
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || ""; // Corrigido para usar emailReff
    const password = passwordRef.current?.value || ""; // Corrigido para usar passwordRef

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    } catch (err: any) {
      console.error("Erro na requisição:", err.message);
      toast.error(
        err.message || "Erro ao criar usuário, tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
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
              <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Digite seu nome"
                      required
                      ref={nameRef}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      ref={emailRef}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      ref={passwordRef}
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
                        Registrando...
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
