import { eventoConfig } from "@/config/evento";
import { SectionHeading } from "@/components/sections/section-heading";

export function Programacao() {
  return (
    <section
      id="programacao"
      className="bg-evento-fundo-secundario/50 py-20 sm:py-28"
    >
      <div className="container">
        <SectionHeading eyebrow="Agenda" title="Programação do dia" />

        <ol className="mx-auto mt-14 max-w-2xl space-y-8 border-l border-border/70 pl-8">
          {eventoConfig.programacao.map((item) => (
            <li key={`${item.horario}-${item.titulo}`} className="relative">
              <span
                aria-hidden
                className="absolute -left-[2.28rem] top-1 h-3 w-3 rounded-full bg-evento-terracota"
              />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.horario}
              </p>
              <p className="mt-1 font-serif text-xl text-evento-marrom">
                {item.titulo}
              </p>
              {item.descricao ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.descricao}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
