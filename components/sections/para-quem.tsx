import { Heart } from "lucide-react";

import { eventoConfig } from "@/config/evento";

export function ParaQuem() {
  return (
    <section className="bg-evento-fundo-secundario/50 py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Para quem é
          </p>
          <h2 className="mt-3 font-display text-3xl text-evento-marrom sm:text-4xl">
            Este encontro é para você
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {eventoConfig.paraQuemE.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <Heart className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
