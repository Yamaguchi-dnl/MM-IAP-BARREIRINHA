"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, MessageCircle, ShieldAlert } from "lucide-react";

import {
  atualizarInscricao,
  anonimizarInscricao,
  type AtualizacaoInscricao,
} from "@/lib/actions/admin";
import type {
  AuditoriaInscricao,
  Inscricao,
} from "@/lib/supabase/database.types";
import { formatarDataHora, rotuloStatusInscricao, rotuloStatusPagamento } from "@/lib/format";
import { gerarLinkWhatsapp } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";

const STATUS_INSCRICAO_OPCOES: Inscricao["status_inscricao"][] = [
  "aguardando_pagamento",
  "confirmada",
  "cancelada",
  "lista_de_espera",
];

const STATUS_PAGAMENTO_OPCOES: Inscricao["status_pagamento"][] = [
  "pendente",
  "confirmado",
  "isento",
  "cancelado",
];

export function InscricaoDetalhe({
  inscricao,
  auditoria,
}: {
  inscricao: Inscricao;
  auditoria: AuditoriaInscricao[];
}) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    nome_completo: inscricao.nome_completo,
    telefone: inscricao.telefone,
    email: inscricao.email ?? "",
    cidade: inscricao.cidade,
    igreja: inscricao.igreja ?? "",
    restricao_alimentar: inscricao.restricao_alimentar ?? "",
    necessidade_acessibilidade: inscricao.necessidade_acessibilidade ?? "",
    observacoes: inscricao.observacoes ?? "",
    observacoes_administrativas: inscricao.observacoes_administrativas ?? "",
    status_inscricao: inscricao.status_inscricao,
    status_pagamento: inscricao.status_pagamento,
  });

  function atualizarCampo<K extends keyof typeof form>(
    campo: K,
    valor: (typeof form)[K],
  ) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvar() {
    setSalvando(true);
    try {
      const patch: AtualizacaoInscricao = {
        nome_completo: form.nome_completo,
        telefone: form.telefone,
        email: form.email || null,
        cidade: form.cidade,
        igreja: form.igreja || null,
        restricao_alimentar: form.restricao_alimentar || null,
        necessidade_acessibilidade: form.necessidade_acessibilidade || null,
        observacoes: form.observacoes || null,
        observacoes_administrativas: form.observacoes_administrativas || null,
        status_inscricao: form.status_inscricao,
        status_pagamento: form.status_pagamento,
      };

      const resultado = await atualizarInscricao(inscricao.id, patch);

      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Inscrição atualizada com sucesso.");
      router.refresh();
    } finally {
      setSalvando(false);
    }
  }

  async function anonimizar() {
    setSalvando(true);
    try {
      const resultado = await anonimizarInscricao(inscricao.id);
      if (!resultado.sucesso) {
        toast.error(resultado.erro);
        return;
      }
      toast.success("Dados anonimizados com sucesso.");
      router.push("/admin");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input
                value={form.nome_completo}
                onChange={(e) => atualizarCampo("nome_completo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => atualizarCampo("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={form.cidade}
                onChange={(e) => atualizarCampo("cidade", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Igreja</Label>
              <Input
                value={form.igreja}
                onChange={(e) => atualizarCampo("igreja", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Restrição alimentar</Label>
              <Textarea
                value={form.restricao_alimentar}
                onChange={(e) =>
                  atualizarCampo("restricao_alimentar", e.target.value)
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Necessidade de acessibilidade</Label>
              <Textarea
                value={form.necessidade_acessibilidade}
                onChange={(e) =>
                  atualizarCampo("necessidade_acessibilidade", e.target.value)
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observações da participante</Label>
              <Textarea
                value={form.observacoes}
                onChange={(e) => atualizarCampo("observacoes", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status da inscrição</Label>
              <Select
                value={form.status_inscricao}
                onValueChange={(valor) =>
                  atualizarCampo(
                    "status_inscricao",
                    valor as Inscricao["status_inscricao"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_INSCRICAO_OPCOES.map((opcao) => (
                    <SelectItem key={opcao} value={opcao}>
                      {rotuloStatusInscricao(opcao)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status do pagamento</Label>
              <Select
                value={form.status_pagamento}
                onValueChange={(valor) =>
                  atualizarCampo(
                    "status_pagamento",
                    valor as Inscricao["status_pagamento"],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_PAGAMENTO_OPCOES.map((opcao) => (
                    <SelectItem key={opcao} value={opcao}>
                      {rotuloStatusPagamento(opcao)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observações administrativas (interno)</Label>
              <Textarea
                value={form.observacoes_administrativas}
                onChange={(e) =>
                  atualizarCampo("observacoes_administrativas", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
            <Button asChild variant="outline">
              <a
                href={gerarLinkWhatsapp(inscricao.nome_completo, inscricao.codigo)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> Conversar no WhatsApp
              </a>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={salvando}>
                  {salvando ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Salvar alterações
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar alterações?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso vai atualizar os dados e status desta inscrição. Essa
                    ação fica registrada no histórico de auditoria.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={salvar}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Código
            </p>
            <p className="font-serif text-2xl text-evento-marrom">
              {inscricao.codigo}
            </p>
            <p className="text-xs text-muted-foreground">
              Inscrita em {formatarDataHora(inscricao.created_at)}
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={salvando}>
                  <ShieldAlert className="h-4 w-4" />
                  Anonimizar dados (LGPD)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Anonimizar esta inscrição?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Os dados pessoais serão substituídos permanentemente e a
                    inscrição será cancelada. Essa ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={anonimizar}>
                    Anonimizar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico de auditoria
            </p>
            {auditoria.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma alteração registrada ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {auditoria.map((registro) => (
                  <li key={registro.id} className="text-xs text-foreground/80">
                    <p className="font-medium">{registro.campo_alterado}</p>
                    <p className="text-muted-foreground">
                      {registro.valor_anterior || "—"} → {registro.valor_novo || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {formatarDataHora(registro.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
