"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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

const BookingOnLogin = () => {
  const [isLoading, startTransition] = useTransition();
  const handleLoginWithGoogle = () => {
    try {
      startTransition(async () => {
        await signIn("google");
        toast.success("Sucesso!");
      });
    } catch (error) {
      toast.error("Erro ao fazer login com o Google.");
    }
  };
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

      let { code, error } = response;
      // console.log(code, error, ok, status);

      if (error == "CredentialsSignin" && code == "credentials") {
        toast.error("Credenciais inválidas. Por favor, tente novamente.");
        return null;
      } else {
        toast.success("Login Efetuado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao realizar o login!");
    }
  };
  return (
    <>
      <CardContent className="items-center justify-center text-foreground">
        <h1 className="text-center">
          Faça login, para verificar seus agendametos!
        </h1>
        <div className="flex w-full items-center justify-between gap-4 p-2">
          <Button
            variant="secondary"
            className="w-full gap-2 border p-2"
            onClick={handleLoginWithGoogle}
          >
            <Image
              src={isLoading ? "loading2.svg" : "google.svg"}
              width={18}
              height={18}
              alt="Login Button"
            />
            Fazer Login
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full gap-2 border p-2">
                <Image
                  src="cred2.svg"
                  width={20}
                  height={20}
                  alt="Login Button"
                />
                Email&Senha
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] rounded-lg">
              <DialogHeader>
                <DialogTitle>Entre com E-mail & Senha</DialogTitle>
                <DialogDescription>
                  Se você fez seu registro com e-mail e senha, faça login, por
                  aqui.
                </DialogDescription>
              </DialogHeader>

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
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </>
  );
};

export default BookingOnLogin;
