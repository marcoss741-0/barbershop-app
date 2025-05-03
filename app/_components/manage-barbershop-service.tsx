"use client";

import { useState } from "react";
import { BarbershopService, Service } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/app/_components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toast } from "sonner";
import {
  addBarbershopService,
  updateBarbershopService,
  deleteBarbershopService,
} from "@/app/_actions/manage-barbershop-services"; // Ajuste o caminho
import Image from "next/image";
import { Trash2, Edit } from "lucide-react";

// --- Zod Schema for Add/Edit Service Form ---
const barbershopServiceFormSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço padrão."), // Only for adding
  name: z.string().min(3, "Nome muito curto."),
  description: z.string().min(5, "Descrição muito curta."),
  price: z.coerce
    .number({
      invalid_type_error: "Preço deve ser um número.",
    })
    .positive("Preço deve ser positivo."),
});

type BarbershopServiceFormData = z.infer<typeof barbershopServiceFormSchema>;

// --- Props for the main component ---
interface ManageBarbershopServicesProps {
  barbershopId: string;
  existingServices: (BarbershopService & {
    Service: Pick<Service, "name"> | null;
  })[]; // Inclui nome do serviço base
  standardServices: Pick<Service, "id" | "name">[]; // Lista de serviços padrão para o dropdown
}

// --- Main Component ---
export function ManageBarbershopServices({
  barbershopId,
  existingServices,
  standardServices,
}: ManageBarbershopServicesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<BarbershopService | null>(null);

  // --- Form Hook ---
  const form = useForm<BarbershopServiceFormData>({
    resolver: zodResolver(barbershopServiceFormSchema),
  });

  const setDefaultImage = (serviceName: string) => {
    switch (serviceName) {
      case "Corte":
        return "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png";

      case "Barba":
        return "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png";

      case "Sobrancelha":
        return "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png";

      case "Massagem":
        return "utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png";

      case "Hidratacao":
        return "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png";

      case "Pezinho":
        return "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png";

      default:
        return "https://res.cloudinary.com/dz84imb8z/image/upload/v1746272782/ChatGPT_Image_3_de_mai._de_2025_08_45_32_kg3h5l.png";
    }
  };

  // --- Handlers ---
  const handleAddSubmit = async (data: any) => {
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
        setIsAddDialogOpen(false);
        form.reset();
        // Revalidação no server action deve atualizar a lista
      } else {
        toast.error(`Erro: ${result.error || "Não foi possível adicionar."}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao adicionar serviço.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingService) return;
    setIsSubmitting(true);
    const serviceImage =
      data.imageUrl && data.imageUrl.trim() !== ""
        ? data.imageUrl
        : setDefaultImage(data.name);

    try {
      // Note: serviceId não é usado na atualização, apenas os outros campos
      const result = await updateBarbershopService({
        barbershopServiceId: editingService.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: serviceImage,
      });
      if (result.success) {
        toast.success("Serviço atualizado com sucesso!");
        setIsEditDialogOpen(false);
        setEditingService(null);
        form.reset();
        // Revalidação no server action deve atualizar a lista
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
        // Revalidação no server action deve atualizar a lista
      } else {
        toast.error(`Erro: ${result.error || "Não foi possível remover."}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao remover serviço.");
    }
  };

  const openEditDialog = (service: BarbershopService) => {
    setEditingService(service);
    form.reset({
      serviceId: service.serviceId || undefined, // Não editável, mas pode ser útil ter
      name: service.name,
      description: service.description,
      price: service.price.toNumber(), // Converter Decimal para number
    });
    setIsEditDialogOpen(true);
  };

  // --- Service Form Component (Reused for Add/Edit) ---
  const ServiceForm = ({
    onSubmit,
    isEditMode = false,
  }: {
    onSubmit: (data: BarbershopServiceFormData) => void;
    isEditMode?: boolean;
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isEditMode && (
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviços Base</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço base" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {standardServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o serviço base (ex: Corte, Barba).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Exibição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Corte Degradê" {...field} />
              </FormControl>
              <FormDescription>
                Como este serviço aparecerá para os clientes desta barbearia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Específica</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhes do serviço nesta barbearia..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="50.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Image
                src="/loading2.svg"
                width={18}
                height={18}
                alt="Loading..."
              />
            ) : isEditMode ? (
              "Salvar Alterações"
            ) : (
              "Adicionar Serviço"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // --- Render Component ---
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardDescription>
              Adicione, edite ou remova os serviços específicos da sua
              barbearia.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={() => form.reset()}>
              Adicionar Serviço
            </Button>
          </DialogTrigger>

          <DialogContent className="h-[60%] w-[90%] overflow-y-auto rounded-md [&::-webkit-scrollbar]:hidden">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Serviço</DialogTitle>
            </DialogHeader>
            <ServiceForm onSubmit={handleAddSubmit} />
          </DialogContent>

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
                      <p className="font-medium text-[14px]">{service.name}</p>
                      <p className="text-sm font-bold">
                        R$ {Number(service.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Edit Button/Dialog */}
                    <Dialog
                      open={
                        isEditDialogOpen && editingService?.id === service.id
                      }
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsEditDialogOpen(false);
                          setEditingService(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[90%]">
                        <DialogHeader>
                          <DialogTitle>
                            Editar Serviço: {editingService?.name}
                          </DialogTitle>
                        </DialogHeader>
                        <ServiceForm
                          onSubmit={handleEditSubmit}
                          isEditMode={true}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Delete Button/Dialog */}
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
    </Dialog>
  );
}
