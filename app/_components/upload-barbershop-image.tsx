"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button"; // Ajuste o caminho
import { Input } from "@/app/_components/ui/input"; // Ajuste o caminho
import { Label } from "@/app/_components/ui/label"; // Ajuste o caminho
import { toast } from "sonner";
import { updateBarbershopImage } from "@/app/_actions/update-barbershop-image"; // Ajuste o caminho
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Props do Componente ---
interface UploadBarbershopImageProps {
  barbershopId: string;
  currentImageUrl: string | null;
}

// --- Componente de Upload de Imagem ---
export function UploadBarbershopImage({
  barbershopId,
  currentImageUrl,
}: UploadBarbershopImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Criar URL de preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(currentImageUrl); // Volta para a imagem atual se deselecionar
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Por favor, selecione um arquivo de imagem primeiro.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("barbershopId", barbershopId);

    try {
      const result = await updateBarbershopImage(formData);

      if (result.success && result.imageUrl) {
        toast.success("Imagem atualizada com sucesso!");
        setFile(null); // Limpa o estado do arquivo selecionado
        // A revalidação no server action deve atualizar a imagem na página
        // Forçar um refresh se a revalidação não for suficiente (menos ideal)
        // router.refresh();
      } else {
        toast.error(
          `Erro ao atualizar imagem: ${result.error || "Erro desconhecido."}`,
        );
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Ocorreu um erro inesperado durante o upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview da Imagem */}
      {previewUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={previewUrl}
            alt="Preview ou Imagem Atual"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}

      {/* Input de Arquivo */}
      <div className="mt-auto flex w-full max-w-sm flex-col items-center gap-1.5">
        <Label htmlFor={`picture-${barbershopId}`}>Nova Imagem</Label>
        <Input
          id={`picture-${barbershopId}`}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {/* Botão de Upload */}
      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={!file || isLoading}
      >
        {isLoading ? (
          <Image src="/loading2.svg" width={18} height={18} alt="Loading..." />
        ) : (
          "Salvar Nova Imagem"
        )}
      </Button>
    </div>
  );
}
