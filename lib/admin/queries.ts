import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Inscricao,
  StatusInscricao,
  StatusPagamento,
} from "@/lib/supabase/database.types";

export const ITENS_POR_PAGINA = 20;

export type FiltrosInscricoes = {
  busca?: string;
  statusPagamento?: StatusPagamento | "todos";
  statusInscricao?: StatusInscricao | "todos";
  cidade?: string;
  igreja?: string;
  pagina?: number;
};

export async function getAdminAtual() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("administradores")
    .select("id, nome, email, ativo")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin || !admin.ativo) return null;

  return admin;
}

export async function listarInscricoes(filtros: FiltrosInscricoes) {
  const supabase = createClient();
  const pagina = filtros.pagina ?? 1;
  const de = (pagina - 1) * ITENS_POR_PAGINA;
  const ate = de + ITENS_POR_PAGINA - 1;

  let query = supabase
    .from("inscricoes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(de, ate);

  if (filtros.busca) {
    const termo = filtros.busca.trim();
    query = query.or(
      `nome_completo.ilike.%${termo}%,codigo.ilike.%${termo}%,telefone.ilike.%${termo}%,email.ilike.%${termo}%`,
    );
  }

  if (filtros.statusPagamento && filtros.statusPagamento !== "todos") {
    query = query.eq("status_pagamento", filtros.statusPagamento);
  }

  if (filtros.statusInscricao && filtros.statusInscricao !== "todos") {
    query = query.eq("status_inscricao", filtros.statusInscricao);
  }

  if (filtros.cidade) {
    query = query.ilike("cidade", `%${filtros.cidade}%`);
  }

  if (filtros.igreja) {
    query = query.ilike("igreja", `%${filtros.igreja}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error("Não foi possível carregar as inscrições.");
  }

  return {
    inscricoes: (data ?? []) as Inscricao[],
    total: count ?? 0,
    totalPaginas: Math.max(1, Math.ceil((count ?? 0) / ITENS_POR_PAGINA)),
    pagina,
  };
}

export async function getInscricaoPorId(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inscricoes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Inscricao;
}

export async function getAuditoriaDaInscricao(inscricaoId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("auditoria_inscricoes")
    .select("*")
    .eq("inscricao_id", inscricaoId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getEstatisticasDashboard() {
  const supabase = createClient();

  const [
    totalRes,
    pendentesRes,
    confirmadosRes,
    canceladosRes,
    valorConfirmadoRes,
  ] = await Promise.all([
    supabase.from("inscricoes").select("id", { count: "exact", head: true }),
    supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true })
      .eq("status_pagamento", "pendente"),
    supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true })
      .eq("status_pagamento", "confirmado"),
    supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true })
      .eq("status_inscricao", "cancelada"),
    supabase
      .from("inscricoes")
      .select("valor_inscricao")
      .eq("status_pagamento", "confirmado"),
  ]);

  const valorTotalConfirmado = (valorConfirmadoRes.data ?? []).reduce(
    (acc, row) => acc + Number(row.valor_inscricao ?? 0),
    0,
  );

  return {
    total: totalRes.count ?? 0,
    pagamentosPendentes: pendentesRes.count ?? 0,
    pagamentosConfirmados: confirmadosRes.count ?? 0,
    inscricoesCanceladas: canceladosRes.count ?? 0,
    valorTotalConfirmado,
  };
}
