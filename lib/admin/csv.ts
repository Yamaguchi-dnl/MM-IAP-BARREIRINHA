import "server-only";

import type { Inscricao } from "@/lib/supabase/database.types";
import { formatarDataHora } from "@/lib/format";

const COLUNAS: { chave: keyof Inscricao; rotulo: string }[] = [
  { chave: "codigo", rotulo: "Código" },
  { chave: "nome_completo", rotulo: "Nome completo" },
  { chave: "data_nascimento", rotulo: "Data de nascimento" },
  { chave: "telefone", rotulo: "Telefone" },
  { chave: "email", rotulo: "E-mail" },
  { chave: "igreja", rotulo: "Igreja" },
  { chave: "cidade", rotulo: "Cidade" },
  { chave: "restricao_alimentar", rotulo: "Restrição alimentar" },
  { chave: "necessidade_acessibilidade", rotulo: "Necessidade de acessibilidade" },
  { chave: "status_inscricao", rotulo: "Status da inscrição" },
  { chave: "status_pagamento", rotulo: "Status do pagamento" },
  { chave: "valor_inscricao", rotulo: "Valor da inscrição" },
  { chave: "data_confirmacao_pagamento", rotulo: "Confirmação do pagamento" },
  { chave: "observacoes_administrativas", rotulo: "Observações administrativas" },
  { chave: "created_at", rotulo: "Criado em" },
];

function escaparCelula(valor: unknown) {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/[",;\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export function gerarCsvInscricoes(inscricoes: Inscricao[]) {
  const cabecalho = COLUNAS.map((coluna) => coluna.rotulo).join(";");

  const linhas = inscricoes.map((inscricao) =>
    COLUNAS.map((coluna) => {
      const valor = inscricao[coluna.chave];
      if (
        (coluna.chave === "created_at" ||
          coluna.chave === "data_confirmacao_pagamento") &&
        valor
      ) {
        return escaparCelula(formatarDataHora(String(valor)));
      }
      return escaparCelula(valor);
    }).join(";"),
  );

  return ["﻿" + cabecalho, ...linhas].join("\n");
}
