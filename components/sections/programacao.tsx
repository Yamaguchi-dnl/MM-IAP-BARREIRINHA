import { eventoConfig } from "@/config/evento";

export function Programacao() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Programação
          </p>
          <h2 className="mt-3 font-display text-3xl text-evento-marrom sm:text-4xl">
            Como vai ser a manhã
          </h2>
        </div>

        <ol className="mx-auto mt-12 max-w-xl space-y-8 border-l border-border pl-6">
          {eventoConfig.programacao.map((item) => (
            <li key={item.horario} className="relative">
              <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full bg-primary" />
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {item.horario}
              </p>
              <p className="mt-1 font-display text-lg text-evento-marrom">{item.titulo}</p>
              {item.descricao ? (
                <p className="mt-1 text-sm text-muted-foreground">{item.descricao}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
