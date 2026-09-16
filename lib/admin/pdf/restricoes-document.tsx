import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

import { eventoConfig } from "@/config/evento";
import { mascararTelefone, formatarDataHora } from "@/lib/format";
import type { Inscricao } from "@/lib/supabase/database.types";

const COR_PRIMARIA = "#882c2b";
const COR_TEXTO = "#2b201d";
const COR_MUTED = "#6b5645";
const COR_BORDA = "#e3d6c7";
const COR_FUNDO_SECUNDARIO = "#f7f1ea";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COR_TEXTO,
  },
  faixaTopo: {
    height: 6,
    backgroundColor: COR_PRIMARIA,
    marginHorizontal: -40,
    marginTop: -40,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COR_PRIMARIA,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: COR_PRIMARIA,
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 10,
    color: COR_MUTED,
    marginTop: 6,
  },
  resumo: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  resumoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COR_BORDA,
    borderRadius: 6,
    backgroundColor: COR_FUNDO_SECUNDARIO,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  resumoNumero: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COR_PRIMARIA,
  },
  resumoRotulo: {
    fontSize: 8,
    color: COR_MUTED,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  secaoEyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COR_PRIMARIA,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  secaoTitulo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COR_PRIMARIA,
    marginTop: 4,
    marginBottom: 16,
  },
  tabela: {
    borderWidth: 1,
    borderColor: COR_BORDA,
    borderRadius: 4,
  },
  linhaCabecalho: {
    flexDirection: "row",
    backgroundColor: COR_FUNDO_SECUNDARIO,
    borderBottomWidth: 1,
    borderBottomColor: COR_BORDA,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  linha: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COR_BORDA,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  linhaSemBorda: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  celulaCabecalho: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COR_PRIMARIA,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colNome: { width: "24%" },
  colCidade: { width: "16%" },
  colTelefone: { width: "18%" },
  colDetalhe: { width: "42%" },
  vazio: {
    fontSize: 9.5,
    color: COR_MUTED,
    fontStyle: "italic",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COR_BORDA,
    borderRadius: 4,
  },
  rodape: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COR_MUTED,
    borderTopWidth: 1,
    borderTopColor: COR_BORDA,
    paddingTop: 8,
  },
});

type LinhaRestricao = {
  nome: string;
  cidade: string;
  telefone: string;
  detalhe: string;
};

function paraLinhas(
  inscricoes: Inscricao[],
  campo: "restricao_alimentar" | "necessidade_acessibilidade",
): LinhaRestricao[] {
  return inscricoes
    .filter((inscricao) => {
      const valor = inscricao[campo];
      return typeof valor === "string" && valor.trim() !== "";
    })
    .map((inscricao) => ({
      nome: inscricao.nome_completo,
      cidade: inscricao.cidade,
      telefone: mascararTelefone(inscricao.telefone),
      detalhe: String(inscricao[campo]),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function Rodape({ geradoEm }: { geradoEm: string }) {
  return (
    <View style={styles.rodape} fixed>
      <Text>Gerado em {geradoEm}</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  );
}

function CabecalhoTabela() {
  return (
    <View style={styles.linhaCabecalho} fixed>
      <Text style={[styles.celulaCabecalho, styles.colNome]}>Nome</Text>
      <Text style={[styles.celulaCabecalho, styles.colCidade]}>Cidade</Text>
      <Text style={[styles.celulaCabecalho, styles.colTelefone]}>
        Telefone
      </Text>
      <Text style={[styles.celulaCabecalho, styles.colDetalhe]}>
        Detalhes
      </Text>
    </View>
  );
}

function Tabela({ linhas }: { linhas: LinhaRestricao[] }) {
  if (linhas.length === 0) {
    return <Text style={styles.vazio}>Nenhum registro informado.</Text>;
  }

  return (
    <View style={styles.tabela}>
      <CabecalhoTabela />
      {linhas.map((linha, indice) => (
        <View
          key={`${linha.nome}-${indice}`}
          style={
            indice === linhas.length - 1 ? styles.linhaSemBorda : styles.linha
          }
          wrap={false}
        >
          <Text style={styles.colNome}>{linha.nome}</Text>
          <Text style={styles.colCidade}>{linha.cidade}</Text>
          <Text style={styles.colTelefone}>{linha.telefone}</Text>
          <Text style={styles.colDetalhe}>{linha.detalhe}</Text>
        </View>
      ))}
    </View>
  );
}

function PaginaSecao({
  eyebrow,
  titulo,
  geradoEm,
  children,
}: {
  eyebrow: string;
  titulo: string;
  geradoEm: string;
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.faixaTopo} fixed />
      <Text style={styles.secaoEyebrow}>{eyebrow}</Text>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {children}
      <Rodape geradoEm={geradoEm} />
    </Page>
  );
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
      <Page size="A4" style={styles.page}>
        <View style={styles.faixaTopo} fixed />

        <Text style={styles.eyebrow}>{eventoConfig.nomeIgreja}</Text>
        <Text style={styles.titulo}>Restrições e acessibilidade</Text>
        <Text style={styles.subtitulo}>
          {eventoConfig.nomeEvento} · {eventoConfig.dataEventoExibicao}
        </Text>

        <View style={styles.resumo}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{inscricoes.length}</Text>
            <Text style={styles.resumoRotulo}>Inscrições consideradas</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{alimentares.length}</Text>
            <Text style={styles.resumoRotulo}>Restrições alimentares</Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoNumero}>{acessibilidade.length}</Text>
            <Text style={styles.resumoRotulo}>Acessibilidade</Text>
          </View>
        </View>

        <Rodape geradoEm={geradoEm} />
      </Page>

      <PaginaSecao
        eyebrow="Restrições alimentares"
        titulo="Restrições alimentares"
        geradoEm={geradoEm}
      >
        <Tabela linhas={alimentares} />
      </PaginaSecao>

      <PaginaSecao
        eyebrow="Necessidades de acessibilidade"
        titulo="Necessidades de acessibilidade"
        geradoEm={geradoEm}
      >
        <Tabela linhas={acessibilidade} />
      </PaginaSecao>
    </Document>
  );
}
