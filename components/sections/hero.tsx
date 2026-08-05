import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/sections/hero-background";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <HeroBackground />

      <div className="container relative flex flex-col items-center gap-6 py-28 text-center text-evento-branco">
        <span className="animate-fade-up rounded-full border border-evento-branco/30 bg-evento-branco/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-sm">
          {eventoConfig.nomeIgreja}
        </span>

        <h1 className="animate-fade-up text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">
          {eventoConfig.temaEvento}
        </h1>

        <p
          className="animate-fade-up flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-balance text-sm text-evento-branco/85 sm:text-base"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {eventoConfig.local}
          </span>
        </p>

        <div className="animate-fade-up pt-2" style={{ animationDelay: "0.15s" }}>
          <Button
            size="lg"
            asChild
            className="bg-evento-branco text-evento-marrom hover:bg-evento-branco/90"
          >
            <Link href="/inscricao">Quero me inscrever</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
