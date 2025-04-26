"use server";

import { SheetContent } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarInteractiveElements } from "./sidebar-interactive-elements";
import { auth, signIn } from "../_lib/auth-option";

const SidebarSheet = async () => {
  const data = await auth();
  const user = data?.user;
  const { image, name, email } = user || {};

  return (
    <>
      <SheetContent className="&[::-webkit-scrollbar]:hidden w-full overflow-y-auto">
        {user ? (
          <>
            <div className="flex items-center justify-start gap-2 border-b border-solid p-5 md:p-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src={image || ""} className="h-10 w-10" />
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
