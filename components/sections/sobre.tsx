import { Leaf } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { SectionHeading } from "@/components/sections/section-heading";

export function Sobre() {
  return (
    <section id="sobre" className="py-20 sm:py-28">
      <div className="container grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <SectionHeading
            align="left"
            eyebrow="Sobre o evento"
            title="Um encontro pensado para o seu coração"
            className="mx-0"
          />
          <p className="text-balance leading-relaxed text-foreground/80">
            {eventoConfig.descricaoCompleta}
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
          <div className="flex items-center gap-2 text-evento-vinho">
            <Leaf className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-wide">
              Para quem é este evento
            </p>
          </div>
          <ul className="space-y-3">
            {eventoConfig.paraQuemE.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
              >
                <span
                  aria-hidden
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-evento-terracota"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
