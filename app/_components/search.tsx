"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Digite algo para buscar",
  }),
});

const SearchInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const router = useRouter();

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?title=${data.title}`);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center justify-center gap-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Faça sua busca..."
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage className="flex" />
              </FormItem>
            )}
          />
          <Button size="default" type="submit">
            <SearchIcon size={18} />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SearchInput;
