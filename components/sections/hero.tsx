import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/sections/countdown";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-organic-blob">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-evento-vinho/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-evento-terracota/10 blur-3xl" />

      <div className="container relative flex flex-col items-center gap-8 py-20 text-center sm:py-28">
        <span className="animate-fade-up rounded-full border border-evento-terracota/30 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-evento-terracota">
          {eventoConfig.nomeIgreja}
        </span>

        <h1 className="animate-fade-up text-balance font-serif text-4xl font-semibold leading-tight text-evento-marrom sm:text-6xl">
          {eventoConfig.nomeEvento}
        </h1>

        <p
          className="animate-fade-up max-w-xl text-balance text-lg leading-relaxed text-foreground/80"
          style={{ animationDelay: "0.1s" }}
        >
          {eventoConfig.temaEvento}
        </p>

        <div
          className="animate-fade-up flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/70"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {eventoConfig.local}
          </span>
        </div>

        <div
          className="animate-fade-up flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.2s" }}
        >
          <Button size="lg" asChild>
            <Link href="/inscricao">Quero me inscrever</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#sobre">Saiba mais</a>
          </Button>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <Countdown dataEventoISO={eventoConfig.dataEventoISO} />
        </div>
      </div>
    </section>
  );
}
