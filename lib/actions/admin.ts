"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getAdminAtual, getInscricaoPorId } from "@/lib/admin/queries";
import type { ResultadoAcao } from "@/lib/actions/inscricoes";
import type {
  Inscricao,
  StatusInscricao,
  StatusPagamento,
} from "@/lib/supabase/database.types";

export type AtualizacaoInscricao = Partial<
  Pick<
    Inscricao,
    | "nome_completo"
    | "data_nascimento"
    | "telefone"
    | "email"
    | "igreja"
    | "cidade"
    | "restricao_alimentar"
    | "necessidade_acessibilidade"
    | "observacoes"
    | "status_inscricao"
    | "status_pagamento"
    | "valor_inscricao"
    | "observacoes_administrativas"
  >
>;

const CAMPOS_AUDITADOS: (keyof AtualizacaoInscricao)[] = [
  "status_inscricao",
  "status_pagamento",
  "valor_inscricao",
  "observacoes_administrativas",
  "nome_completo",
  "telefone",
  "email",
  "cidade",
  "igreja",
];

export async function atualizarInscricao(
  id: string,
  atualizacao: AtualizacaoInscricao,
): Promise<ResultadoAcao<null>> {
  const admin = await getAdminAtual();

  if (!admin) {
    return { sucesso: false, erro: "Sessão administrativa inválida." };
  }

  const inscricaoAtual = await getInscricaoPorId(id);

  if (!inscricaoAtual) {
    return { sucesso: false, erro: "Inscrição não encontrada." };
  }

  const supabase = createClient();
  const payload: AtualizacaoInscricao = { ...atualizacao };

  if (
    payload.status_pagamento === "confirmado" &&
    inscricaoAtual.status_pagamento !== "confirmado"
  ) {
    (payload as Partial<Inscricao>).data_confirmacao_pagamento =
      new Date().toISOString();
  }

  if (
    payload.status_pagamento &&
    payload.status_pagamento !== "confirmado" &&
    inscricaoAtual.status_pagamento === "confirmado"
  ) {
    (payload as Partial<Inscricao>).data_confirmacao_pagamento = null;
  }

  const { error } = await supabase
    .from("inscricoes")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {
      sucesso: false,
      erro: "Não foi possível salvar as alterações.",
    };
  }

  const registrosAuditoria = CAMPOS_AUDITADOS.filter(
    (campo) =>
      campo in atualizacao &&
      String(inscricaoAtual[campo] ?? "") !== String(atualizacao[campo] ?? ""),
  ).map((campo) => ({
    inscricao_id: id,
    administrador_id: admin.id,
    campo_alterado: campo,
    valor_anterior: String(inscricaoAtual[campo] ?? ""),
    valor_novo: String(atualizacao[campo] ?? ""),
  }));

  if (registrosAuditoria.length > 0) {
    await supabase.from("auditoria_inscricoes").insert(registrosAuditoria);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/inscricoes/${id}`);

  return { sucesso: true, dados: null };
}

export async function alterarStatusInscricao(
  id: string,
  statusInscricao: StatusInscricao,
) {
  return atualizarInscricao(id, { status_inscricao: statusInscricao });
}

export async function alterarStatusPagamento(
  id: string,
  statusPagamento: StatusPagamento,
) {
  return atualizarInscricao(id, { status_pagamento: statusPagamento });
}

export async function anonimizarInscricao(
  id: string,
): Promise<ResultadoAcao<null>> {
  const admin = await getAdminAtual();

  if (!admin) {
    return { sucesso: false, erro: "Sessão administrativa inválida." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("inscricoes")
    .update({
      nome_completo: "Participante removida (LGPD)",
      telefone: "00000000000",
      email: null,
      igreja: null,
      restricao_alimentar: null,
      necessidade_acessibilidade: null,
      observacoes: null,
      status_inscricao: "cancelada",
    })
    .eq("id", id);

  if (error) {
    return { sucesso: false, erro: "Não foi possível anonimizar a inscrição." };
  }

  await supabase.from("auditoria_inscricoes").insert({
    inscricao_id: id,
    administrador_id: admin.id,
    campo_alterado: "anonimizacao_lgpd",
    valor_anterior: "dados pessoais presentes",
    valor_novo: "dados anonimizados",
  });

  revalidatePath("/admin");

  return { sucesso: true, dados: null };
}
