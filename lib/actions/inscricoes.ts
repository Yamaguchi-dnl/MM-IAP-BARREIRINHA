"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { gerarCodigoInscricao } from "@/lib/codigo";
import { eventoConfig, inscricoesEstaoAbertas } from "@/config/evento";
import {
  consultaInscricaoSchema,
  inscricaoFormSchema,
  type InscricaoFormValues,
} from "@/lib/validations/inscricao";
import type { Inscricao } from "@/lib/supabase/database.types";

export type ResultadoAcao<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: string };

function vazioParaNull(valor: string | undefined) {
  if (!valor || valor.trim() === "") return null;
  return valor.trim();
}

export async function criarInscricao(
  valoresBrutos: InscricaoFormValues,
): Promise<ResultadoAcao<{ codigo: string }>> {
  const parsed = inscricaoFormSchema.safeParse(valoresBrutos);

  if (!parsed.success) {
    return {
      sucesso: false,
      erro: "Alguns dados do formulário são inválidos. Revise e tente novamente.",
    };
  }

  if (!inscricoesEstaoAbertas()) {
    return {
      sucesso: false,
      erro: "O prazo para inscrições neste evento já foi encerrado.",
    };
  }

  const valores = parsed.data;
  const supabase = createAdminClient();

  if (eventoConfig.limiteVagas !== null) {
    const { count, error: erroContagem } = await supabase
      .from("inscricoes")
      .select("id", { count: "exact", head: true })
      .neq("status_inscricao", "cancelada");

    if (erroContagem) {
      return {
        sucesso: false,
        erro: "Não foi possível verificar as vagas disponíveis. Tente novamente em instantes.",
      };
    }

    if ((count ?? 0) >= eventoConfig.limiteVagas) {
      return {
        sucesso: false,
        erro: "As vagas para este evento já foram preenchidas.",
      };
    }
  }

  const { data: existente } = await supabase
    .from("inscricoes")
    .select("codigo")
    .eq("telefone", valores.telefone)
    .neq("status_inscricao", "cancelada")
    .maybeSingle();

  if (existente) {
    return {
      sucesso: false,
      erro: `Este telefone já possui uma inscrição (código ${existente.codigo}). Use a consulta de inscrição para acompanhar.`,
    };
  }

  let tentativas = 0;
  while (tentativas < 5) {
    const codigo = gerarCodigoInscricao();

    const { error: erroInsercao } = await supabase.from("inscricoes").insert({
      codigo,
      nome_completo: valores.nomeCompleto,
      data_nascimento: valores.dataNascimento,
      telefone: valores.telefone,
      email: vazioParaNull(valores.email),
      igreja: vazioParaNull(valores.igreja),
      cidade: valores.cidade,
      restricao_alimentar: vazioParaNull(valores.restricaoAlimentar),
      necessidade_acessibilidade: vazioParaNull(
        valores.necessidadeAcessibilidade,
      ),
      observacoes: vazioParaNull(valores.observacoes),
      consentimento_privacidade: valores.consentimentoPrivacidade,
      status_inscricao: "aguardando_pagamento",
      status_pagamento: eventoConfig.valorInscricao > 0 ? "pendente" : "isento",
      valor_inscricao: eventoConfig.valorInscricao,
    });

    if (!erroInsercao) {
      return { sucesso: true, dados: { codigo } };
    }

    // 23505 = violação de unicidade (código ou telefone duplicado)
    if (erroInsercao.code !== "23505") {
      return {
        sucesso: false,
        erro: "Não foi possível concluir a inscrição. Tente novamente em instantes.",
      };
    }

    tentativas += 1;
  }

  return {
    sucesso: false,
    erro: "Não foi possível gerar um código de inscrição único. Tente novamente.",
  };
}

type InscricaoPublica = Pick<
  Inscricao,
  | "codigo"
  | "nome_completo"
  | "status_inscricao"
  | "status_pagamento"
  | "valor_inscricao"
  | "created_at"
>;

export async function consultarInscricao(
  valoresBrutos: unknown,
): Promise<ResultadoAcao<InscricaoPublica>> {
  const parsed = consultaInscricaoSchema.safeParse(valoresBrutos);

  if (!parsed.success) {
    return { sucesso: false, erro: "Informe o código e o contato corretos." };
  }

  const codigo = parsed.data.codigo.trim().toUpperCase();
  const contato = parsed.data.contato.trim().toLowerCase();
  const contatoDigitos = contato.replace(/\D/g, "");

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("inscricoes")
    .select(
      "codigo, nome_completo, status_inscricao, status_pagamento, valor_inscricao, created_at, telefone, email",
    )
    .eq("codigo", codigo)
    .maybeSingle();

  if (error || !data) {
    return {
      sucesso: false,
      erro: "Não encontramos nenhuma inscrição com esses dados.",
    };
  }

  const telefoneConfere =
    contatoDigitos.length >= 10 && data.telefone === contatoDigitos;
  const emailConfere =
    !!data.email && data.email.toLowerCase() === contato;

  if (!telefoneConfere && !emailConfere) {
    return {
      sucesso: false,
      erro: "Não encontramos nenhuma inscrição com esses dados.",
    };
  }

  return {
    sucesso: true,
    dados: {
      codigo: data.codigo,
      nome_completo: data.nome_completo,
      status_inscricao: data.status_inscricao,
      status_pagamento: data.status_pagamento,
      valor_inscricao: data.valor_inscricao,
      created_at: data.created_at,
    },
  };
}
