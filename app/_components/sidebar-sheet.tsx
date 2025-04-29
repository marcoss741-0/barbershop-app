"use client";

import { SheetContent } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarInteractiveElements } from "./sidebar-interactive-elements";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogDescription, DialogTitle } from "./ui/dialog";

interface UserData {
  user?: {
    image?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
}

const SidebarSheet = () => {
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const user = userData?.user ?? null;
  const { image, name, email } = user || {};

  return (
    <>
      <SheetContent className="&[::-webkit-scrollbar]:hidden w-full overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>Barra de Menu Lateral</DialogDescription>
        </VisuallyHidden>
        {user ? (
          <>
            <div className="flex items-center justify-start gap-2 border-b border-solid p-5 md:p-10">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={image == null ? "/perfil.png" : image}
                  className="h-10 w-10"
                />
                <AvatarFallback>{name?.split(" ", 1) || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-[16px] font-bold">{name}</p>
                <p className="text-xs font-normal">{email}</p>
              </div>
            </div>
          </>
        ) : null}

        <SidebarInteractiveElements user={user} />
      </SheetContent>
    </>
  );
};

export default SidebarSheet;
