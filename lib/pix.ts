/**
 * Gerador do payload Pix "copia e cola" (BR Code), no formato EMV definido
 * pelo Banco Central. Implementado localmente — sem gateway de pagamento e
 * sem dependências externas de rede.
 */

function tlv(id: string, value: string) {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

const DIACRITICOS = /[̀-ͯ]/g;

function normalizarTexto(valor: string, tamanhoMaximo: number) {
  return valor
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, tamanhoMaximo);
}

function crc16(payload: string) {
  let crc = 0xffff;
  const polinomio = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ polinomio) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type DadosPix = {
  chave: string;
  nomeBeneficiario: string;
  cidade: string;
  valor?: number;
  txid?: string;
  descricao?: string;
};

export function gerarPayloadPix({
  chave,
  nomeBeneficiario,
  cidade,
  valor,
  txid,
  descricao,
}: DadosPix) {
  const merchantAccountInfo =
    tlv("00", "br.gov.bcb.pix") +
    tlv("01", chave) +
    (descricao ? tlv("02", normalizarTexto(descricao, 40)) : "");

  const additionalData = tlv("05", txid ? normalizarTexto(txid, 25) : "***");

  const semCrc =
    tlv("00", "01") +
    tlv("26", merchantAccountInfo) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (valor && valor > 0 ? tlv("54", valor.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", normalizarTexto(nomeBeneficiario, 25) || "RECEBEDOR") +
    tlv("60", normalizarTexto(cidade, 15) || "CIDADE") +
    tlv("62", additionalData) +
    "6304";

  return semCrc + crc16(semCrc);
}
