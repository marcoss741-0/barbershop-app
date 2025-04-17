"use client";

import { SmartphoneIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PhoneItemProps {
  phone: string;
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneButton = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Telefone copiado!");
  };
  return (
    <>
      <div key={phone} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SmartphoneIcon width={24} height={24} />
          <p className="text-sm">{phone}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCopyPhoneButton(phone)}
        >
          Copiar
        </Button>
      </div>
    </>
  );
};

export default PhoneItem;
