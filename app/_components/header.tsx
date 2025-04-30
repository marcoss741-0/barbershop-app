import { MenuIcon, ScissorsIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarSheet from "./sidebar-sheet";
import Link from "next/link";
import { ModeToggle } from "./toggle-theme";

const Header = () => {
  return (
    <>
      <Card className="rounded-none">
        <CardContent className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex gap-2">
              <ScissorsIcon className="h-8 w-8 font-bold text-primary" />
              <h1 className="text-[20px] font-semibold text-foreground">
                ÔMEGA BARBER´S
              </h1>
            </Link>
          </div>
          <ModeToggle />
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size={"icon"}
                  variant="outline"
                  className="cursor-pointer"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SidebarSheet />
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Header;
