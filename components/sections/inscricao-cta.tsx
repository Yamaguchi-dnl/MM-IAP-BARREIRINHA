import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import { eventoConfig, inscricoesEstaoAbertas } from "@/config/evento";
import { formatarMoeda } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function InscricaoCta() {
  const aberta = inscricoesEstaoAbertas();

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl text-evento-marrom sm:text-4xl">
              Garanta sua vaga
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {eventoConfig.descricaoCurta}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-foreground/80">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {eventoConfig.local}
              </span>
              <span className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                {eventoConfig.valorInscricao > 0
                  ? formatarMoeda(eventoConfig.valorInscricao)
                  : eventoConfig.valorInscricaoExibicao}
              </span>
            </div>

            <div className="mt-8">
              {aberta ? (
                <Button asChild size="lg">
                  <Link href="/inscricao">Quero me inscrever</Link>
                </Button>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  As inscrições para este encontro já foram encerradas.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
