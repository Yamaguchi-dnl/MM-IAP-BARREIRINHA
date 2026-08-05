"use client";

import { useEffect, useState } from "react";

function calcularRestante(dataAlvo: string) {
  const diferenca = new Date(dataAlvo).getTime() - Date.now();

  if (diferenca <= 0) {
    return { dias: 0, horas: 0, minutos: 0, encerrado: true };
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);

  return { dias, horas, minutos, encerrado: false };
}

export function Countdown({ dataEventoISO }: { dataEventoISO: string }) {
  const [tempo, setTempo] = useState<ReturnType<typeof calcularRestante> | null>(
    null,
  );

  useEffect(() => {
    setTempo(calcularRestante(dataEventoISO));
    const intervalo = setInterval(() => {
      setTempo(calcularRestante(dataEventoISO));
    }, 60_000);
    return () => clearInterval(intervalo);
  }, [dataEventoISO]);

  if (!tempo || tempo.encerrado) return null;

  const unidades = [
    { valor: tempo.dias, rotulo: "dias" },
    { valor: tempo.horas, rotulo: "horas" },
    { valor: tempo.minutos, rotulo: "min" },
  ];

  return (
    <div
      className="flex items-center gap-3 sm:gap-4"
      role="timer"
      aria-label="Contagem regressiva para o evento"
    >
      {unidades.map((unidade) => (
        <div
          key={unidade.rotulo}
          className="flex min-w-[4.5rem] flex-col items-center rounded-2xl border border-border/70 bg-card/80 px-3 py-2 shadow-sm"
        >
          <span className="font-serif text-2xl font-semibold text-evento-terracota sm:text-3xl">
            {unidade.valor}
          </span>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {unidade.rotulo}
          </span>
        </div>
      ))}
    </div>
  );
}
