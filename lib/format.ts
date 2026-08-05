export function mascararTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarData(valor: string | Date) {
  const data = typeof valor === "string" ? new Date(valor) : valor;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

export function formatarDataHora(valor: string | Date) {
  const data = typeof valor === "string" ? new Date(valor) : valor;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

const RESPOSTAS_STATUS_INSCRICAO: Record<string, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  lista_de_espera: "Lista de espera",
};

const RESPOSTAS_STATUS_PAGAMENTO: Record<string, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  isento: "Isento",
  cancelado: "Cancelado",
};

export function rotuloStatusInscricao(status: string) {
  return RESPOSTAS_STATUS_INSCRICAO[status] ?? status;
}

export function rotuloStatusPagamento(status: string) {
  return RESPOSTAS_STATUS_PAGAMENTO[status] ?? status;
}
