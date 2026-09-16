import { Document } from "@react-pdf/renderer";

import { eventoConfig } from "@/config/evento";
import {
  mascararTelefone,
  formatarDataHora,
  rotuloStatusInscricao,
  rotuloStatusPagamento,
} from "@/lib/format";
import type { Inscricao } from "@/lib/supabase/database.types";
import {
  PaginaCapa,
  PaginaSecao,
  Tabela,
  type ColunaTabela,
} from "@/lib/admin/pdf/pdf-kit";

type LinhaInscricao = {
  chave: string;
  nome: string;
  cidade: string;
  telefone: string;
  statusInscricao: string;
  statusPagamento: string;
};

const COLUNAS: ColunaTabela<LinhaInscricao>[] = [
  { chave: "nome", rotulo: "Nome", largura: "28%", render: (l) => l.nome },
  { chave: "cidade", rotulo: "Cidade", largura: "18%", render: (l) => l.cidade },
  {
    chave: "telefone",
    rotulo: "Telefone",
    largura: "18%",
    render: (l) => l.telefone,
  },
  {
    chave: "statusInscricao",
    rotulo: "Inscrição",
    largura: "18%",
    render: (l) => l.statusInscricao,
  },
  {
    chave: "statusPagamento",
    rotulo: "Pagamento",
    largura: "18%",
    render: (l) => l.statusPagamento,
  },
];

function paraLinhas(inscricoes: Inscricao[]): LinhaInscricao[] {
  return inscricoes
    .map((inscricao) => ({
      chave: inscricao.id,
      nome: inscricao.nome_completo,
      cidade: inscricao.cidade,
      telefone: mascararTelefone(inscricao.telefone),
      statusInscricao: rotuloStatusInscricao(inscricao.status_inscricao),
      statusPagamento: rotuloStatusPagamento(inscricao.status_pagamento),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function InscricoesDocument({
  inscricoes,
}: {
  inscricoes: Inscricao[];
}) {
  const linhas = paraLinhas(inscricoes);
  const geradoEm = formatarDataHora(new Date());

  const canceladas = inscricoes.filter(
    (i) => i.status_inscricao === "cancelada",
  ).length;
  const confirmadas = inscricoes.filter(
    (i) => i.status_pagamento === "confirmado",
  ).length;
  const pendentes = inscricoes.filter(
    (i) => i.status_pagamento === "pendente",
  ).length;

  return (
    <Document
      title={`Inscrições - ${eventoConfig.nomeEvento}`}
      author={eventoConfig.nomeIgreja}
    >
      <PaginaCapa
        nomeIgreja={eventoConfig.nomeIgreja}
        titulo="Todas as inscrições"
        subtitulo={`${eventoConfig.nomeEvento} · ${eventoConfig.dataEventoExibicao}`}
        geradoEm={geradoEm}
        cartoes={[
          { numero: inscricoes.length, rotulo: "Total" },
          { numero: confirmadas, rotulo: "Confirmadas" },
          { numero: pendentes, rotulo: "Pendentes" },
          { numero: canceladas, rotulo: "Canceladas" },
        ]}
      />

      <PaginaSecao
        eyebrow={eventoConfig.nomeEvento}
        titulo="Lista de inscrições"
        geradoEm={geradoEm}
      >
        <Tabela colunas={COLUNAS} linhas={linhas} />
      </PaginaSecao>
    </Document>
  );
}
