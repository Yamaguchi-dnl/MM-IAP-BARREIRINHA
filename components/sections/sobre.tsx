import { eventoConfig } from "@/config/evento";

export function Sobre() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Sobre o encontro
          </p>
          <h2 className="mt-3 font-display text-3xl text-evento-marrom sm:text-4xl">
            Um tempo para sentar aos pés de Jesus
          </h2>
          <p className="mt-6 text-balance leading-relaxed text-foreground/80">
            {eventoConfig.descricaoCompleta}
          </p>
        </div>
      </div>
    </section>
  );
}
