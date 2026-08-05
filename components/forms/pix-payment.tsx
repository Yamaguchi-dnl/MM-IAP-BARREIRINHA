"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Check, Copy, MessageCircle } from "lucide-react";

import { eventoConfig, gerarLinkWhatsapp } from "@/config/evento";
import { formatarMoeda } from "@/lib/format";
import { gerarPayloadPix } from "@/lib/pix";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PixPayment({
  codigo,
  nome,
}: {
  codigo: string;
  nome: string;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const payload = gerarPayloadPix({
    chave: eventoConfig.pix.chave,
    nomeBeneficiario: eventoConfig.pix.nomeBeneficiario,
    cidade: eventoConfig.pix.cidade,
    valor: eventoConfig.valorInscricao > 0 ? eventoConfig.valorInscricao : undefined,
    txid: codigo.replace(/[^A-Za-z0-9]/g, ""),
  });

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 280 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(null));
  }, [payload]);

  async function copiarChave() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopiado(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Copie manualmente.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-success/30 bg-success/5 p-5 text-center">
        <p className="text-sm font-medium text-success">
          Inscrição recebida com sucesso!
        </p>
        <p className="mt-1 text-2xl font-serif font-semibold text-evento-marrom">
          {codigo}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Guarde este código — ele será usado para consultar sua inscrição.
        </p>
      </div>

      {eventoConfig.valorInscricao > 0 ? (
        <>
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <p className="text-sm text-muted-foreground">Valor a pagar</p>
              <p className="font-serif text-3xl text-evento-terracota">
                {formatarMoeda(eventoConfig.valorInscricao)}
              </p>

              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code Pix para pagamento da inscrição"
                  width={220}
                  height={220}
                  className="rounded-xl border border-border/70"
                  unoptimized
                />
              ) : (
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  Gerando QR Code…
                </div>
              )}

              <div className="w-full space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Pix copia e cola
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
                  <code className="flex-1 truncate text-xs text-foreground/80">
                    {payload}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copiarChave}
                  >
                    {copiado ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="w-full space-y-1 text-left text-sm text-foreground/80">
                <p>
                  <span className="font-medium">Beneficiário:</span>{" "}
                  {eventoConfig.pix.nomeBeneficiario}
                </p>
                <p>
                  <span className="font-medium">Cidade:</span>{" "}
                  {eventoConfig.pix.cidade}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm text-foreground/80">
            <p className="font-medium">Como concluir o pagamento:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Abra o aplicativo do seu banco e escolha pagar via Pix.</li>
              <li>Escaneie o QR Code acima ou cole o código copiado.</li>
              <li>Confirme o valor e finalize o pagamento.</li>
              <li>Envie o comprovante pelo WhatsApp usando o botão abaixo.</li>
            </ol>
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Este evento não possui cobrança de inscrição.
        </p>
      )}

      <Button asChild size="lg" className="w-full" variant="secondary">
        <a
          href={gerarLinkWhatsapp(nome, codigo)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          Enviar comprovante pelo WhatsApp
        </a>
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        O QR Code não representa confirmação automática do pagamento. Sua
        inscrição será confirmada manualmente pela nossa equipe após a
        conferência do comprovante.
      </p>
    </div>
  );
}
