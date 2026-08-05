import type { Metadata } from "next";

import { eventoConfig } from "@/config/evento";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

export default function PaginaPrivacidade() {
  return (
    <>
      <Header />
      <main className="py-16 sm:py-20">
        <div className="container max-w-2xl space-y-6">
          <h1 className="font-serif text-3xl text-evento-marrom">
            Política de privacidade
          </h1>

          <p className="text-sm leading-relaxed text-foreground/80">
            Esta página descreve, de forma simples, como o {eventoConfig.nomeIgreja}{" "}
            trata os dados fornecidos na inscrição do evento{" "}
            {eventoConfig.nomeEvento}.
          </p>

          <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
            <div>
              <h2 className="font-serif text-lg text-evento-marrom">
                Quais dados coletamos
              </h2>
              <p>
                Coletamos apenas os dados necessários para organizar o
                evento: nome completo, data de nascimento, telefone, e-mail
                (opcional), igreja/congregação (opcional), cidade,
                informações sobre restrição alimentar e acessibilidade
                (quando informadas) e observações.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-evento-marrom">
                Como usamos seus dados
              </h2>
              <p>
                Os dados são usados exclusivamente para confirmar sua
                inscrição, organizar a logística do evento e entrar em
                contato quando necessário. Não compartilhamos seus dados com
                terceiros para fins comerciais.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-evento-marrom">
                Seus direitos
              </h2>
              <p>
                Você pode solicitar a correção ou remoção dos seus dados a
                qualquer momento entrando em contato pelo e-mail{" "}
                <a
                  href={`mailto:${eventoConfig.emailContato}`}
                  className="underline"
                >
                  {eventoConfig.emailContato}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-serif text-lg text-evento-marrom">
                Pagamento via Pix
              </h2>
              <p>
                O pagamento da inscrição é feito manualmente via Pix. Não
                coletamos dados bancários — apenas confirmamos manualmente o
                recebimento após a conferência do comprovante enviado por
                WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
