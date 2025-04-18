import { MenuIcon, ScissorsIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarSheet from "./sidebar-sheet";

const Header = () => {
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-2">
            <ScissorsIcon className="h-8 w-8 font-bold text-purple-900" />
            <h1 className="text-2xl font-normal text-gray-100">
              ÔMEGA BARBER´S
            </h1>
          </div>
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
