/**
 * Configuração central do evento.
 *
 * Este é o ÚNICO lugar que deve ser editado para trocar textos, datas,
 * valores, contatos e dados de Pix do site. Nada disso deve ser hardcoded
 * em componentes ou páginas.
 *
 * Valores marcados como "[A_DEFINIR...]" são placeholders e precisam ser
 * substituídos pelos dados reais antes da publicação. Nenhum dado de
 * contato, Pix ou credencial foi inventado.
 */

export type ItemProgramacao = {
  horario: string;
  titulo: string;
  descricao?: string;
};

export type Convidada = {
  nome: string;
  papel: string;
  descricao?: string;
  foto?: string;
};

export type PerguntaFrequente = {
  pergunta: string;
  resposta: string;
};

export const eventoConfig = {
  // Identificação do evento
  nomeEvento: "Encontro de Mulheres",
  temaEvento: "Como ser Maria em um mundo que exige Marta",
  descricaoCurta:
    "Um tempo de comunhão e renovo para mulheres, à luz de Lucas 10:38-42 — com almoço especial incluso.",
  descricaoCompleta:
    "Baseado em Lucas 10:38-42, este encontro é um convite para respirar fundo em meio à correria do dia a dia e escolher, como Maria, sentar aos pés de Jesus. Vamos refletir juntas sobre como viver a devoção de Maria em um mundo que constantemente nos exige a agitação de Marta — em uma manhã de comunhão, palavra e um almoço especial preparado com carinho para você.",

  // Data, horário e local
  // Formato ISO (AAAA-MM-DD) para permitir cálculo de contagem regressiva e prazo.
  dataEventoISO: "2026-09-27",
  dataEventoExibicao: "27 de setembro de 2026 (domingo)",
  horario: "10h, com almoço especial às 12h",
  local: "IAP Barreirinha (em frente ao Parque da Barreirinha)",
  endereco: "Rua Flávio Dallegrave, 9745 - Barreirinha, Curitiba - PR, 82510-010",
  linkMapa: "[A_DEFINIR: Link do Google Maps, opcional]",

  // Inscrição
  valorInscricao: 35,
  valorInscricaoExibicao: "R$ 35,00 (dinheiro ou Pix)",
  limiteVagas: null as number | null, // null = sem limite de vagas
  prazoInscricaoISO: "2026-09-20",

  // Pix (dados reais)
  pix: {
    chave: "17716778000102",
    nomeBeneficiario: "Convenção Regional Sul",
    cidade: "Curitiba",
  },

  // Contato
  numeroWhatsappComprovante: "5541997112814",
  instagram: "[A_DEFINIR: Link do Instagram]",
  emailContato: "[A_DEFINIR: E-mail de contato]",

  // Identidade visual
  logo: "/logo-iap.png",
  imagemPrincipal: "/hero.png",
  imagemSocial: "/og-image.jpg",

  // Conteúdo institucional
  nomeIgreja: "IAP Barreirinha — Ministério de Mulheres",

  paraQuemE: [
    "Mulheres que se sentem sobrecarregadas pela correria do dia a dia e precisam de um tempo de pausa.",
    "Quem deseja aprofundar a comunhão com Deus e viver a devoção de Maria aos pés de Jesus.",
    "Toda mulher da igreja e convidadas que queiram viver uma manhã especial de renovo.",
  ],

  programacao: [
    {
      horario: "10h00",
      titulo: "Recepção e abertura",
    },
    {
      horario: "10h30",
      titulo: "Palavra: Como ser Maria em um mundo que exige Marta",
      descricao: "Ministração baseada em Lucas 10:38-42.",
    },
    {
      horario: "12h00",
      titulo: "Almoço especial",
    },
  ] as ItemProgramacao[],

  convidadas: [] as Convidada[],

  faqs: [
    {
      pergunta: "O almoço está incluso na inscrição?",
      resposta:
        "Sim! Às 12h será servido um almoço especial para todas as participantes inscritas.",
    },
    {
      pergunta: "Até quando posso me inscrever?",
      resposta: "As inscrições vão até 20/09. Garanta sua vaga com antecedência.",
    },
    {
      pergunta: "Como faço o pagamento da inscrição?",
      resposta:
        "O pagamento pode ser feito em dinheiro ou via Pix. Ao se inscrever pelo site, você recebe a chave Pix, o QR Code e pode enviar o comprovante direto pelo WhatsApp.",
    },
  ] as PerguntaFrequente[],
} as const;

export function gerarMensagemWhatsapp(nome: string, codigo: string) {
  return `Olá! Estou enviando o comprovante do evento ${eventoConfig.nomeEvento}. Nome: ${nome}. Código da inscrição: ${codigo}.`;
}

export function gerarLinkWhatsapp(nome: string, codigo: string) {
  const numero = eventoConfig.numeroWhatsappComprovante.replace(/\D/g, "");
  const mensagem = encodeURIComponent(gerarMensagemWhatsapp(nome, codigo));
  return `https://wa.me/${numero}?text=${mensagem}`;
}

export function inscricoesEstaoAbertas(dataReferencia: Date = new Date()) {
  const prazo = new Date(`${eventoConfig.prazoInscricaoISO}T23:59:59`);
  return dataReferencia.getTime() <= prazo.getTime();
}
