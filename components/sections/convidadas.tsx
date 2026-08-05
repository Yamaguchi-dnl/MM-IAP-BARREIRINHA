import { eventoConfig } from "@/config/evento";
import { SectionHeading } from "@/components/sections/section-heading";

export function Convidadas() {
  if (eventoConfig.convidadas.length === 0) return null;

  return (
    <section id="convidadas" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow="Quem vai estar com a gente" title="Convidadas e equipe" />

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {eventoConfig.convidadas.map((convidada) => (
            <div
              key={convidada.nome}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm"
            >
              <div
                aria-hidden
                className="flex h-20 w-20 items-center justify-center rounded-full bg-evento-bege/60 font-serif text-2xl text-evento-marrom"
              >
                {convidada.nome.charAt(0)}
              </div>
              <p className="font-serif text-lg text-evento-marrom">
                {convidada.nome}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {convidada.papel}
              </p>
              {convidada.descricao ? (
                <p className="text-sm text-muted-foreground">
                  {convidada.descricao}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
