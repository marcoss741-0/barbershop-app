"use client";

import React, { useState } from "react"; // Import React
import { BarbershopService, Service } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/app/_components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { useForm } from "react-hook-form"; // Import UseFormReturn
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  addBarbershopService,
  updateBarbershopService,
  deleteBarbershopService,
} from "@/app/_actions/manage-barbershop-services"; // Ajuste o caminho
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import {
  BarbershopServiceFormData,
  barbershopServiceFormSchema,
  ServiceForm,
} from "./service-form";

// --- Props para o ManageBarbershopServices (igual antes) ---
interface ManageBarbershopServicesProps {
  barbershopId: string;
  existingServices: (BarbershopService & {
    Service: Pick<Service, "name"> | null;
  })[];
  standardServices: Pick<Service, "id" | "name">[];
}

// --- Componente Principal ManageBarbershopServices ---
export function ManageBarbershopServices({
  barbershopId,
  existingServices,
  standardServices,
}: ManageBarbershopServicesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<BarbershopService | null>(null);

  // --- Form Hook (permanece aqui) ---
  const form = useForm<BarbershopServiceFormData>({
    resolver: zodResolver(barbershopServiceFormSchema),
    defaultValues: {
      imageUrl: "",
      serviceId: "", // Adicionar default para serviceId
      name: "",
      description: "",
      price: 0,
    },
  });

  // Função para imagem padrão (igual antes)
  const setDefaultImage = (serviceName: string) => {
    // ... (seu código da função setDefaultImage)
    switch (serviceName) {
      case "Corte":
        return "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png";
      case "Barba":
        return "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png";
      case "Sobrancelha":
        return "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png";
      case "Massagem":
        return "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png"; // Corrigido URL
      case "Hidratacao":
        return "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png";
      case "Pezinho":
        return "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png";
      default:
        return "https://res.cloudinary.com/dz84imb8z/image/upload/v1746272782/ChatGPT_Image_3_de_mai._de_2025_08_45_32_kg3h5l.png";
    }
  };

  const handleAddSubmit = async (data: BarbershopServiceFormData) => {
    if (!data.serviceId) {
      toast.error("Por favor, selecione um serviço padrão base.");
      form.setError("serviceId", {
        type: "manual",
        message: "Campo obrigatório.",
      });
      return;
    }
    setIsSubmitting(true);
    const imageUrl =
      data.imageUrl && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : setDefaultImage(data.name);
    try {
      const result = await addBarbershopService({
        barbershopId: barbershopId,
        serviceId: data.serviceId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl,
      });
      if (result.success) {
        toast.success("Serviço adicionado com sucesso!");
        setIsAddDrawerOpen(false);
        form.reset();
      } else {
        toast.error(`Erro: ${result.error || "Não foi possível adicionar."}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao adicionar serviço.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: BarbershopServiceFormData) => {
    if (!editingService) return;
    setIsSubmitting(true);
    const serviceImage =
      data.imageUrl && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : setDefaultImage(data.name);
    try {
      const result = await updateBarbershopService({
        barbershopServiceId: editingService.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: serviceImage,
      });
      if (result.success) {
        toast.success("Serviço atualizado com sucesso!");
        setIsEditDrawerOpen(false);
        setEditingService(null);
        form.reset();
      } else {
        toast.error(`Erro: ${result.error || "Não foi possível atualizar."}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar serviço.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (barbershopServiceId: string) => {
    try {
      const result = await deleteBarbershopService({ barbershopServiceId });
      if (result.success) {
        toast.success("Serviço removido com sucesso!");
      } else {
        toast.error(`Erro: ${result.error || "Não foi possível remover."}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao remover serviço.");
    }
  };

  const openEditDrawer = (service: BarbershopService) => {
    setEditingService(service);
    form.reset({
      serviceId: service.serviceId || undefined,
      name: service.name,
      description: service.description,
      price: Number(service.price),
      imageUrl: service.imageUrl || "",
    });
    setIsEditDrawerOpen(true);
  };

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription>
            Adicione, edite ou remova os serviços específicos da sua barbearia.
          </CardDescription>
        </div>
        {/* Drawer para Adicionar Serviço */}
        <Drawer
          open={isAddDrawerOpen}
          onOpenChange={setIsAddDrawerOpen}
          modal={false}
        >
          <DrawerTrigger asChild>
            <Button
              onClick={
                () => form.reset() // Resetar para os defaults definidos no useForm
              }
            >
              Adicionar Serviço
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>Adicionar Novo Serviço</DrawerTitle>
            </DrawerHeader>
            {/* Renderizar o ServiceForm extraído */}
            <ServiceForm
              form={form}
              standardServices={standardServices}
              isEditMode={false}
            />
            <DrawerFooter className="pt-4">
              <Button
                onClick={form.handleSubmit(handleAddSubmit)} // Usar handleSubmit aqui
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Image
                    src="/loading2.svg"
                    width={18}
                    height={18}
                    alt="Loading..."
                  />
                ) : (
                  "Adicionar Serviço"
                )}
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardHeader>
      <CardContent>
        {existingServices.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Nenhum serviço adicionado ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {existingServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm font-bold">
                      R$ {Number(service.price)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Drawer para Editar Serviço */}
                  <Drawer
                    open={isEditDrawerOpen && editingService?.id === service.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditDrawerOpen(false);
                        setEditingService(null);
                      }
                    }}
                    modal={false} // Mantendo modal={false} da sua versão anterior
                  >
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDrawer(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-4">
                      <DrawerHeader>
                        <DrawerTitle>
                          Editar Serviço: {editingService?.name}
                        </DrawerTitle>
                      </DrawerHeader>
                      {/* Renderizar o ServiceForm extraído */}
                      <ServiceForm
                        form={form}
                        standardServices={standardServices} // Passar mesmo que não use o select
                        isEditMode={true}
                      />
                      <DrawerFooter className="pt-4">
                        <Button
                          onClick={form.handleSubmit(handleEditSubmit)} // Usar handleSubmit aqui
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Image
                              src="/loading2.svg"
                              width={18}
                              height={18}
                              alt="Loading..."
                            />
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                        <DrawerClose asChild>
                          <Button type="button" variant="outline">
                            Cancelar
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  {/* Delete Button/Dialog (mantido como AlertDialog) */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90%]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso removerá
                          permanentemente o serviço "{service.name}" desta
                          barbearia.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(service.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
