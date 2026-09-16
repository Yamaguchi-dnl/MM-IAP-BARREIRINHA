import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";

export const CORES = {
  primaria: "#882c2b",
  texto: "#2b201d",
  muted: "#6b5645",
  borda: "#e3d6c7",
  fundoSecundario: "#f7f1ea",
};

export const estilosBase = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: CORES.texto,
  },
  faixaTopo: {
    height: 6,
    backgroundColor: CORES.primaria,
    marginHorizontal: -40,
    marginTop: -40,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: CORES.primaria,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  titulo: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: CORES.primaria,
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 10,
    color: CORES.muted,
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
    borderColor: CORES.borda,
    borderRadius: 6,
    backgroundColor: CORES.fundoSecundario,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  resumoNumero: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: CORES.primaria,
  },
  resumoRotulo: {
    fontSize: 8,
    color: CORES.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  secaoEyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: CORES.primaria,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  secaoTitulo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: CORES.primaria,
    marginTop: 4,
    marginBottom: 16,
  },
  tabela: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 4,
  },
  linhaCabecalho: {
    flexDirection: "row",
    backgroundColor: CORES.fundoSecundario,
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  linha: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: CORES.borda,
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
    color: CORES.primaria,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  vazio: {
    fontSize: 9.5,
    color: CORES.muted,
    fontStyle: "italic",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: CORES.borda,
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
    color: CORES.muted,
    borderTopWidth: 1,
    borderTopColor: CORES.borda,
    paddingTop: 8,
  },
});

export function Rodape({ geradoEm }: { geradoEm: string }) {
  return (
    <View style={estilosBase.rodape} fixed>
      <Text>Gerado em {geradoEm}</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
      />
    </View>
  );
}

export function CartaoResumo({
  numero,
  rotulo,
}: {
  numero: number;
  rotulo: string;
}) {
  return (
    <View style={estilosBase.resumoCard}>
      <Text style={estilosBase.resumoNumero}>{numero}</Text>
      <Text style={estilosBase.resumoRotulo}>{rotulo}</Text>
    </View>
  );
}

export function PaginaCapa({
  nomeIgreja,
  titulo,
  subtitulo,
  cartoes,
  geradoEm,
}: {
  nomeIgreja: string;
  titulo: string;
  subtitulo: string;
  cartoes: { numero: number; rotulo: string }[];
  geradoEm: string;
}) {
  return (
    <Page size="A4" style={estilosBase.page}>
      <View style={estilosBase.faixaTopo} fixed />
      <Text style={estilosBase.eyebrow}>{nomeIgreja}</Text>
      <Text style={estilosBase.titulo}>{titulo}</Text>
      <Text style={estilosBase.subtitulo}>{subtitulo}</Text>

      <View style={estilosBase.resumo}>
        {cartoes.map((cartao) => (
          <CartaoResumo key={cartao.rotulo} {...cartao} />
        ))}
      </View>

      <Rodape geradoEm={geradoEm} />
    </Page>
  );
}

export function PaginaSecao({
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
    <Page size="A4" style={estilosBase.page} wrap>
      <View style={estilosBase.faixaTopo} fixed />
      <Text style={estilosBase.secaoEyebrow}>{eyebrow}</Text>
      <Text style={estilosBase.secaoTitulo}>{titulo}</Text>
      {children}
      <Rodape geradoEm={geradoEm} />
    </Page>
  );
}

export type ColunaTabela<T> = {
  chave: string;
  rotulo: string;
  largura: string;
  render: (linha: T) => string;
};

export function Tabela<T extends { chave: string }>({
  colunas,
  linhas,
  mensagemVazia = "Nenhum registro encontrado.",
}: {
  colunas: ColunaTabela<T>[];
  linhas: T[];
  mensagemVazia?: string;
}) {
  if (linhas.length === 0) {
    return <Text style={estilosBase.vazio}>{mensagemVazia}</Text>;
  }

  return (
    <View style={estilosBase.tabela}>
      <View style={estilosBase.linhaCabecalho} fixed>
        {colunas.map((coluna) => (
          <Text
            key={coluna.chave}
            style={[estilosBase.celulaCabecalho, { width: coluna.largura }]}
          >
            {coluna.rotulo}
          </Text>
        ))}
      </View>
      {linhas.map((linha, indice) => (
        <View
          key={linha.chave}
          style={
            indice === linhas.length - 1
              ? estilosBase.linhaSemBorda
              : estilosBase.linha
          }
          wrap={false}
        >
          {colunas.map((coluna) => (
            <Text key={coluna.chave} style={{ width: coluna.largura }}>
              {coluna.render(linha)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
