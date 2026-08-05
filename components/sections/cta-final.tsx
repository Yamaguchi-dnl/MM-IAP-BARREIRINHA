import Link from "next/link";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";

export function CtaFinal() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-evento-marrom px-8 py-16 text-center text-evento-branco sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-evento-terracota/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-evento-vinho/25 blur-3xl" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
            <h2 className="text-balance font-serif text-3xl font-semibold sm:text-4xl">
              Separe esta data para você
            </h2>
            <p className="text-balance text-evento-branco/85">
              {eventoConfig.temaEvento}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/inscricao">Fazer minha inscrição</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
