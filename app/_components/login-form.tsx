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
import { SquareArrowUpRight } from "lucide-react";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface LoginFormProps {
  loginWithGoogle: () => void;
  isLoading: boolean;
}

export function LoginForm({
  className,
  loginWithGoogle,
  isLoading,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
        .then((response) => {
          if (response?.error) {
            console.log(response);
            toast.error("Email ou senha inválidos.");
          } else {
            toast.success("Login realizado com sucesso.");
            console.log(response);
          }
        })
        .catch(() => {
          toast.error("Erro ao realizar login.");
        });
    });
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
                {!isLoading ? (
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
            <form onSubmit={handleLogin} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2 text-primary-foreground"
              >
                {isPending ? (
                  <>
                    <Image
                      src="/loading2.svg"
                      alt="loading"
                      width={20}
                      height={20}
                    />
                  </>
                ) : (
                  <>
                    <SquareArrowUpRight size={18} />
                  </>
                )}
                Entrar
              </Button>
            </form>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <a href="#" className="underline underline-offset-4">
                Inscreva-se
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
