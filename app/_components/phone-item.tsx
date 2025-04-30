"use client";

import { ClipboardList, SmartphoneIcon } from "lucide-react";
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
          <p className="text-sm font-medium text-foreground">{phone}</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="items-center gap-1 border"
          onClick={() => handleCopyPhoneButton(phone)}
        >
          <ClipboardList size={16} />
          Copiar
        </Button>
      </div>
    </>
  );
};

export default PhoneItem;
