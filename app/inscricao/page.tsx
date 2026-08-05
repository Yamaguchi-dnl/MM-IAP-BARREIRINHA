import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import { eventoConfig, inscricoesEstaoAbertas } from "@/config/evento";
import { formatarMoeda } from "@/lib/format";
import { Header } from "@/components/layout/header";
import { InscricaoForm } from "@/components/forms/inscricao-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Inscrição",
  description: `Faça sua inscrição para o ${eventoConfig.nomeEvento}.`,
};

export default function PaginaInscricao() {
  const aberta = inscricoesEstaoAbertas();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-organic-blob py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Card className="lg:sticky lg:top-28">
            <CardContent className="space-y-5 p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Resumo do evento
                </p>
                <h1 className="mt-2 font-display text-2xl text-evento-marrom">
                  {eventoConfig.nomeEvento}
                </h1>
              </div>

              <div className="space-y-3 text-sm text-foreground/80">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {eventoConfig.local}
                </p>
                <p className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  {eventoConfig.valorInscricao > 0
                    ? formatarMoeda(eventoConfig.valorInscricao)
                    : eventoConfig.valorInscricaoExibicao}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Ao se inscrever, seus dados serão usados apenas para a
                organização deste evento. Consulte nossa{" "}
                <Link href="/privacidade" className="underline">
                  política de privacidade
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              {aberta ? (
                <>
                  <h2 className="font-display text-2xl text-evento-marrom">
                    Dados da participante
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Preencha com atenção — usaremos esses dados para
                    confirmar sua vaga.
                  </p>
                  <div className="mt-8">
                    <InscricaoForm />
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <h2 className="font-display text-2xl text-evento-marrom">
                    Inscrições encerradas
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O prazo para inscrições neste evento já foi encerrado.
                    Entre em contato pelo e-mail{" "}
                    <a
                      href={`mailto:${eventoConfig.emailContato}`}
                      className="underline"
                    >
                      {eventoConfig.emailContato}
                    </a>{" "}
                    para mais informações.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
