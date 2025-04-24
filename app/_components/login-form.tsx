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

interface LoginFormProps {
  loginWithGoogle: () => void;
  isPending: boolean;
}

export function LoginForm({
  className,
  loginWithGoogle: handleLoginWithGoogle,
  isPending,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo de volta</CardTitle>
          <CardDescription>Faça login com sua conta Google.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="secondary"
                  className="w-full gap-2"
                  onClick={handleLoginWithGoogle}
                >
                  {!isPending ? (
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
                      alt="Loading"
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
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
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
                  <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <SquareArrowUpRight size={18} />
                  Entrar
                </Button>
              </div>
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Inscreva-se
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
