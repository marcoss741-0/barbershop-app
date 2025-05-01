"use client";

import {
  HomeIcon,
  CalendarDaysIcon,
  LogOutIcon,
  Scissors,
  SquareArrowDownLeft,
  Store,
} from "lucide-react";
import { Button } from "./ui/button";
import { SheetClose } from "./ui/sheet";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "../_lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

export const SidebarInteractiveElements = ({ user }: { user: any }) => {
  const [isGoogleLoading, startTransition] = useTransition();
  const router = useRouter();

  const handleLoginWithGoogle = () => {
    try {
      startTransition(async () => {
        await signIn("google");
        toast.success("Login realizado!");
      });
    } catch (error) {
      toast.error("Erro ao fazer login com o Google.");
    }
  };

  const handleLogout = async () => {
    await signOut().then(() => {
      router.push("/");
    });
  };

  return user ? (
    <>
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button
            size="lg"
            className="justify-start gap-2 border"
            variant="ghost"
            asChild
          >
            <Link href="/">
              <HomeIcon />
              Inicio
            </Link>
          </Button>
        </SheetClose>

        <Button
          variant="ghost"
          size="lg"
          className="justify-start gap-2 border"
          asChild
        >
          <Link href={`/barbershops/manager`}>
            <Store />
            Minhas Barbearias
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="justify-start gap-2 border"
          asChild
        >
          <Link href={"/bookings"}>
            <CalendarDaysIcon />
            Agendamento
          </Link>
        </Button>
      </div>

      {/* <Card className="shadow-none">
        <form>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm">
              Subscribe to our newsletter
            </CardTitle>
            <CardDescription>
              Opt-in to receive updates and news about the sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 p-4">
            <Input type="email" placeholder="Email" />
            <Button
              className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
              size="sm"
            >
              Subscribe
            </Button>
          </CardContent>
        </form>
      </Card> */}

      <SheetClose className="mt-auto flex w-full items-center justify-start gap-2 py-5">
        <Button
          size="default"
          variant="destructive"
          className="w-full justify-start gap-2 p-3"
          onClick={handleLogout}
        >
          <LogOutIcon />
          <p className="text-sm">Sair da Conta</p>
        </Button>
      </SheetClose>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center gap-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Scissors className="size-4" />
          </div>
          ÔmegaBarber´s.
        </a>
        <LoginForm
          isGoogleLoading={isGoogleLoading}
          loginWithGoogle={handleLoginWithGoogle}
        />
      </div>
      <SheetClose>
        <Button variant="secondary" className="gap-2 border font-semibold">
          <SquareArrowDownLeft size={18} />
          Voltar
        </Button>
      </SheetClose>
    </div>
  );
};
