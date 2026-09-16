import { Document } from "@react-pdf/renderer";

import { eventoConfig } from "@/config/evento";
import { mascararTelefone, formatarDataHora } from "@/lib/format";
import type { Inscricao } from "@/lib/supabase/database.types";
import {
  PaginaCapa,
  PaginaSecao,
  Tabela,
  type ColunaTabela,
} from "@/lib/admin/pdf/pdf-kit";

type LinhaRestricao = {
  chave: string;
  nome: string;
  cidade: string;
  telefone: string;
  detalhe: string;
};

const COLUNAS: ColunaTabela<LinhaRestricao>[] = [
  { chave: "nome", rotulo: "Nome", largura: "24%", render: (l) => l.nome },
  { chave: "cidade", rotulo: "Cidade", largura: "16%", render: (l) => l.cidade },
  {
    chave: "telefone",
    rotulo: "Telefone",
    largura: "18%",
    render: (l) => l.telefone,
  },
  {
    chave: "detalhe",
    rotulo: "Detalhes",
    largura: "42%",
    render: (l) => l.detalhe,
  },
];

const RESPOSTAS_NEGATIVAS = new Set([
  "nao",
  "n/a",
  "na",
  "nenhuma",
  "nenhum",
  "-",
  "nenhuma restricao",
  "nenhuma restricao alimentar",
  "nenhuma necessidade",
  "sem restricao",
  "sem restricoes",
  "sem necessidade",
  "sem necessidades",
  "nao tenho",
  "nao possuo",
  "nada",
]);

function normalizarResposta(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[.!]+$/g, "")
    .trim();
}

function ehRespostaNegativa(valor: string) {
  return RESPOSTAS_NEGATIVAS.has(normalizarResposta(valor));
}

function paraLinhas(
  inscricoes: Inscricao[],
  campo: "restricao_alimentar" | "necessidade_acessibilidade",
): LinhaRestricao[] {
  return inscricoes
    .filter((inscricao) => {
      const valor = inscricao[campo];
      return (
        typeof valor === "string" &&
        valor.trim() !== "" &&
        !ehRespostaNegativa(valor)
      );
    })
    .map((inscricao) => ({
      chave: inscricao.id,
      nome: inscricao.nome_completo,
      cidade: inscricao.cidade,
      telefone: mascararTelefone(inscricao.telefone),
      detalhe: String(inscricao[campo]),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function RestricoesDocument({
  inscricoes,
}: {
  inscricoes: Inscricao[];
}) {
  const alimentares = paraLinhas(inscricoes, "restricao_alimentar");
  const acessibilidade = paraLinhas(inscricoes, "necessidade_acessibilidade");
  const geradoEm = formatarDataHora(new Date());

  return (
    <Document
      title={`Restrições - ${eventoConfig.nomeEvento}`}
      author={eventoConfig.nomeIgreja}
    >
      <PaginaCapa
        nomeIgreja={eventoConfig.nomeIgreja}
        titulo="Restrições e acessibilidade"
        subtitulo={`${eventoConfig.nomeEvento} · ${eventoConfig.dataEventoExibicao}`}
        geradoEm={geradoEm}
        cartoes={[
          { numero: inscricoes.length, rotulo: "Inscrições consideradas" },
          { numero: alimentares.length, rotulo: "Restrições alimentares" },
          { numero: acessibilidade.length, rotulo: "Acessibilidade" },
        ]}
      />

      <PaginaSecao
        eyebrow="Restrições alimentares"
        titulo="Restrições alimentares"
        geradoEm={geradoEm}
      >
        <Tabela colunas={COLUNAS} linhas={alimentares} />
      </PaginaSecao>

      <PaginaSecao
        eyebrow="Necessidades de acessibilidade"
        titulo="Necessidades de acessibilidade"
        geradoEm={geradoEm}
      >
        <Tabela colunas={COLUNAS} linhas={acessibilidade} />
      </PaginaSecao>
    </Document>
  );
}
