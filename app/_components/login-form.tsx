"use client";

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
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface LoginFormProps {
  loginWithGoogle: () => void;
  isGoogleLoading: boolean;
}

const schema = z.object({
  email: z.string().email({
    message: "Informe um email valído",
  }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    .max(32, { message: "A senha deve ter no máximo 32 caracteres" }),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({
  className,
  loginWithGoogle,
  isGoogleLoading,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (response?.ok) {
        toast.success("Login realizado com sucesso!");
        window.location.reload();
      }
      if (response.error == "CredentialsSignin") {
        toast.error("Email ou senha incorretos. Por favor, tente novamente.");
        return;
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
                className="w-full gap-2 border"
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
                    src="/loading2.svg"
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="m@exemplo.com"
                              className="font-medium"
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
                            <Input
                              type="password"
                              placeholder="********"
                              className="font-medium"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="min-h-[1.25rem] transition-all duration-200" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 font-bold text-primary-foreground"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Image
                          src="/loading2.svg"
                          width={20}
                          height={20}
                          alt="Carregando"
                        />
                        Entrando
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="text-center text-sm font-medium text-foreground">
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
