import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { formatarMoeda } from "@/lib/format";
import { SectionHeading } from "@/components/sections/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const itens = [
  {
    icone: CalendarDays,
    titulo: "Data",
    valor: eventoConfig.dataEventoExibicao,
  },
  {
    icone: Clock,
    titulo: "Horário",
    valor: eventoConfig.horario,
  },
  {
    icone: MapPin,
    titulo: "Local",
    valor: `${eventoConfig.local} — ${eventoConfig.endereco}`,
  },
  {
    icone: Ticket,
    titulo: "Investimento",
    valor:
      eventoConfig.valorInscricao > 0
        ? formatarMoeda(eventoConfig.valorInscricao)
        : eventoConfig.valorInscricaoExibicao,
  },
];

export function InfoEvento() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Informações práticas"
          title="Tudo o que você precisa saber"
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {itens.map((item) => (
            <Card key={item.titulo}>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-evento-terracota/10 text-evento-terracota">
                  <item.icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.titulo}
                  </p>
                  <p className="mt-1 text-base text-foreground">
                    {item.valor}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
