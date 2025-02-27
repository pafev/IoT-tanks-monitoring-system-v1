"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createGateway, createTank, refresh } from "~/actions";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "../ui/use-toast";
import { DialogClose } from "../ui/dialog";

const formSchema = z.object({
  name: z.string().min(1),
  arduinoId: z.number(),
  fullLevel: z.number(),
  alertLevel: z.number().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
});

export function FormCreateArduino({
  type,
  gatewayId,
}: {
  type: "gateway" | "tank";
  gatewayId?: string;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      arduinoId: 0,
      fullLevel: 0,
      alertLevel: 0,
      description: "",
      address: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if (type === "tank" && gatewayId) {
      console.log({ ...values, gatewayId });
      createTank({ ...values, gatewayId }).catch(() =>
        toast({
          title: "Ops! Algo deu errado",
          description: "Verifique se os campos passados já não existem",
          variant: "destructive",
        }),
      );
      refresh(`/dashboard/gateway/${gatewayId}}`).catch((error) =>
        console.error(error),
      );
    }
    if (type === "gateway") {
      const { fullLevel, alertLevel, ...gatewayValues } = values;
      createGateway(gatewayValues).catch(() =>
        toast({
          title: "Ops! Algo deu errado",
          description: "Verifique se os campos passados já não existem",
          variant: "destructive",
        }),
      );
      refresh("/dashboard").catch((error) => console.error(error));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-1 sm:gap-4"
      >
        <div className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite um nome" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arduinoId"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>ID Arduino</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Escolha um ID para o arduino"
                    type="number"
                    onChange={(value) =>
                      field.onChange(value.target.valueAsNumber)
                    }
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {type === "tank" && (
          <div className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="fullLevel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nivel Total</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o nivel do tanque cheio"
                      type="number"
                      onChange={(value) =>
                        field.onChange(value.target.valueAsNumber)
                      }
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertLevel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nivel de Alerta</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite um nivel de alerta para o tanque"
                      type="number"
                      onChange={(value) =>
                        field.onChange(value.target.valueAsNumber)
                      }
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="hidden sm:block">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite uma descrição para esclarecimetos"
                  className="max-h-40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o endereço do dispositivo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit" className="mt-4">
            Adicionar
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
