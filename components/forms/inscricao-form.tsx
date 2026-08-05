"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { criarInscricao } from "@/lib/actions/inscricoes";
import {
  inscricaoFormSchema,
  type InscricaoFormValues,
} from "@/lib/validations/inscricao";
import { mascararTelefone } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function InscricaoForm() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  const form = useForm<InscricaoFormValues>({
    resolver: zodResolver(inscricaoFormSchema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      telefone: "",
      email: "",
      igreja: "",
      cidade: "",
      restricaoAlimentar: "",
      necessidadeAcessibilidade: "",
      observacoes: "",
      consentimentoPrivacidade: false as unknown as true,
    },
  });

  async function aoEnviar(valores: InscricaoFormValues) {
    if (enviando) return;
    setEnviando(true);

    try {
      const resultado = await criarInscricao(valores);

      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Inscrição recebida com sucesso!");
      const parametros = new URLSearchParams({
        codigo: resultado.dados.codigo,
        nome: valores.nomeCompleto,
      });
      router.push(`/inscricao/sucesso?${parametros.toString()}`);
    } catch {
      toast.error("Não foi possível concluir a inscrição. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(aoEnviar)}
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(00) 00000-0000"
                    value={mascararTelefone(field.value ?? "")}
                    onChange={(evento) =>
                      field.onChange(mascararTelefone(evento.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Sua cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="igreja"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Igreja ou congregação</FormLabel>
                <FormControl>
                  <Input placeholder="Opcional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="restricaoAlimentar"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Possui alguma restrição alimentar?</FormLabel>
                <FormControl>
                  <Textarea placeholder="Opcional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="necessidadeAcessibilidade"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Necessita de algum recurso de acessibilidade?
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Opcional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea placeholder="Opcional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="consentimentoPrivacidade"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(marcado) => field.onChange(marcado === true)}
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-normal leading-relaxed">
                  Autorizo o uso dos meus dados para organização e comunicação
                  relacionada ao evento. *
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={enviando}>
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando inscrição…
            </>
          ) : (
            "Confirmar inscrição"
          )}
        </Button>
      </form>
    </Form>
  );
}
