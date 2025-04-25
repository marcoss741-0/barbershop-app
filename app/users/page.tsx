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
import { createUser } from "../_actions/creating-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    createUser({
      name,
      email,
      password,
    })
      .then(() => {
        toast.success("Usuário criado com sucesso!");
        router.push("/");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao criar usuário, tente novamente mais tarde.");
      });
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
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Registrar
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
