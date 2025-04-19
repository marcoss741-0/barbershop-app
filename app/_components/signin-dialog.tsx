import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";

const handleLoginWithGoogle = async () => {
  await signIn("google");
};
const SigninDialog = () => {
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
        onClick={handleLoginWithGoogle}
      >
        <Image
          src={"/google.svg"}
          alt={"Login com o Google"}
          width={16}
          height={16}
        />
        Google
      </Button>
    </>
  );
};

export default SigninDialog;
