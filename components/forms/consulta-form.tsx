"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";

import {
  consultarInscricao,
  type ResultadoAcao,
} from "@/lib/actions/inscricoes";
import {
  consultaInscricaoSchema,
  type ConsultaInscricaoValues,
} from "@/lib/validations/inscricao";
import {
  formatarMoeda,
  rotuloStatusInscricao,
  rotuloStatusPagamento,
} from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PixPayment } from "@/components/forms/pix-payment";

type Inscricao = Extract<
  Awaited<ReturnType<typeof consultarInscricao>>,
  { sucesso: true }
>["dados"];

export function ConsultaForm() {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAcao<Inscricao> | null>(
    null,
  );

  const form = useForm<ConsultaInscricaoValues>({
    resolver: zodResolver(consultaInscricaoSchema),
    defaultValues: { codigo: "", contato: "" },
  });

  async function aoEnviar(valores: ConsultaInscricaoValues) {
    if (carregando) return;
    setCarregando(true);
    setResultado(null);

    try {
      const resposta = await consultarInscricao(valores);
      setResultado(resposta);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(aoEnviar)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código da inscrição *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: MM-A1B2C3"
                    autoCapitalize="characters"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone ou e-mail usado na inscrição *</FormLabel>
                <FormControl>
                  <Input placeholder="WhatsApp ou e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={carregando}>
            {carregando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Consultando…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Consultar inscrição
              </>
            )}
          </Button>
        </form>
      </Form>

      {resultado && !resultado.sucesso ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {resultado.erro}
        </p>
      ) : null}

      {resultado && resultado.sucesso ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="font-serif text-xl text-evento-marrom">
                {resultado.dados.nome_completo}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Inscrição: {rotuloStatusInscricao(resultado.dados.status_inscricao)}
                </Badge>
                <Badge
                  variant={
                    resultado.dados.status_pagamento === "confirmado"
                      ? "success"
                      : resultado.dados.status_pagamento === "cancelado"
                        ? "destructive"
                        : "warning"
                  }
                >
                  Pagamento: {rotuloStatusPagamento(resultado.dados.status_pagamento)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Valor da inscrição: {formatarMoeda(resultado.dados.valor_inscricao)}
              </p>
            </CardContent>
          </Card>

          {resultado.dados.status_pagamento === "pendente" ? (
            <Card>
              <CardContent className="p-6">
                <PixPayment
                  codigo={resultado.dados.codigo}
                  nome={resultado.dados.nome_completo}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
