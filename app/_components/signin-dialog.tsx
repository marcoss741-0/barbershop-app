// Created by: Marcos Martins
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const SigninDialog = () => {
  const [loading, setLoading] = useState(false);

  const handleLoginWithGoogle = async () => {
    try {
      setLoading(true);
      await signIn("google");
    } catch (e) {
      toast.error("Erro ao fazer login com o Google.", {
        description: "Tente novamente mais tarde." + e,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>
      <Button
        className="items-center gap-2 text-[14px] font-bold"
        variant="outline"
        disabled={loading}
        onClick={handleLoginWithGoogle}
      >
        {loading ? (
          <Image
            src={"/loading.svg"}
            alt={"Carregando..."}
            width={16}
            height={16}
          />
        ) : (
          <Image
            src={"/google.svg"}
            alt={"Login com o Google"}
            width={16}
            height={16}
          />
        )}
        Google
      </Button>
    </>
  );
};

export default SigninDialog;
