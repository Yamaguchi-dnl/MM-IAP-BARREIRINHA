const OPCOES_STATUS_PAGAMENTO = [
  { value: "todos", label: "Todos os pagamentos" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "isento", label: "Isento" },
  { value: "cancelado", label: "Cancelado" },
];

const OPCOES_STATUS_INSCRICAO = [
  { value: "todos", label: "Todas as inscrições" },
  { value: "aguardando_pagamento", label: "Aguardando pagamento" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "lista_de_espera", label: "Lista de espera" },
];

const classeInput =
  "h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FiltrosForm({
  valores,
}: {
  valores: {
    busca?: string;
    statusPagamento?: string;
    statusInscricao?: string;
    cidade?: string;
    igreja?: string;
  };
}) {
  return (
    <form
      method="get"
      className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <input
        type="search"
        name="busca"
        placeholder="Nome, código, telefone ou e-mail"
        defaultValue={valores.busca}
        className={`${classeInput} lg:col-span-2`}
      />
      <select
        name="statusPagamento"
        defaultValue={valores.statusPagamento ?? "todos"}
        className={classeInput}
      >
        {OPCOES_STATUS_PAGAMENTO.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
      <select
        name="statusInscricao"
        defaultValue={valores.statusInscricao ?? "todos"}
        className={classeInput}
      >
        {OPCOES_STATUS_INSCRICAO.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="cidade"
        placeholder="Cidade"
        defaultValue={valores.cidade}
        className={classeInput}
      />
      <input
        type="text"
        name="igreja"
        placeholder="Igreja"
        defaultValue={valores.igreja}
        className={`${classeInput} lg:col-span-2`}
      />
      <button
        type="submit"
        className="h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Filtrar
      </button>
      <a
        href="/admin"
        className="flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium text-foreground hover:bg-muted/60"
      >
        Limpar filtros
      </a>
    </form>
  );
}
