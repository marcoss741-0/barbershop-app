import Image from "next/image";
import { cn } from "../_lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  loginWithGoogle: () => void;
  isGoogleLoading: boolean;
}

export function LoginForm({
  className,
  loginWithGoogle,
  isGoogleLoading,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Iniciando tentativa de login para:", email);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Resultado do login:", result);

      if (result.error == "CredentialsSignin") {
        // console.error("Erro no login:", result.error);
        toast.error("Email ou senha incorretos. Por favor, tente novamente.");
        return;
      }

      if (result.ok == true) {
        toast.success("Login realizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.",
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo de volta</CardTitle>
          <CardDescription>Faça login com sua conta Google.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={loginWithGoogle}
              >
                {!isGoogleLoading ? (
                  <Image
                    src="/google.svg"
                    width={20}
                    height={20}
                    alt="Login with google"
                  />
                ) : (
                  <Image
                    src="/loading.svg"
                    width={20}
                    height={20}
                    alt="is loading"
                  />
                )}
                Entrar com Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 text-primary-foreground"
                >
                  Entrar
                </Button>
              </div>
            </form>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/users" className="underline underline-offset-4">
                Inscreva-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
