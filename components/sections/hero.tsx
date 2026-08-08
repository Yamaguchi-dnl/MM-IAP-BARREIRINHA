import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { Camera } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FotoColagem = {
  src: string;
  alt: string;
};

const fotosColagem: FotoColagem[] = [
  { src: "/oracao.jpg", alt: "Mulheres em oração durante o encontro" },
  { src: "/prega.jpg", alt: "Ministração da palavra no encontro" },
  { src: "/louvor.jpg", alt: "Momento de louvor no encontro" },
  { src: "/abraco.jpg", alt: "Abraço entre participantes do encontro" },
];

function fotoExiste(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

function Foto({ foto, className }: { foto: FotoColagem; className?: string }) {
  const existe = fotoExiste(foto.src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-evento-terracota/10 shadow-xl shadow-evento-marrom/20",
        className,
      )}
    >
      {existe ? (
        <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 224px, 45vw" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-evento-terracota/50">
          <Camera className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const [oracao, prega, louvor, abraco] = fotosColagem;

  return (
    <section className="relative overflow-hidden bg-evento-branco">
      <div className="flex items-center justify-between px-6 py-6 sm:px-10 lg:grid lg:grid-cols-3 lg:px-12 xl:px-20 2xl:px-32">
        <Link href="/" className="flex items-center gap-3 lg:justify-self-start">
          <span className="relative h-10 w-10">
            <Image src={eventoConfig.logo} alt={eventoConfig.nomeIgreja} fill className="object-contain" />
          </span>
        </Link>

        <span className="font-display text-sm font-medium tracking-wide text-evento-argila lg:justify-self-center">
          {eventoConfig.nomeEvento}
        </span>

        <Button
          asChild
          size="sm"
          className="hidden bg-evento-argila text-evento-branco hover:bg-evento-argila/90 lg:inline-flex lg:justify-self-end"
        >
          <Link href="/inscricao">inscreva-se</Link>
        </Button>
      </div>

      <div className="relative py-10 lg:flex lg:min-h-[80vh] lg:items-center lg:py-16 xl:min-h-[85vh]">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute left-[3%] top-1/2 w-48 -translate-y-[74%] xl:left-[6%] xl:w-56 2xl:left-[10%] 2xl:w-64">
            <Foto foto={oracao} className="relative aspect-[3/4] w-full -rotate-3" />
            <Foto foto={abraco} className="absolute left-[-8%] top-[62%] aspect-[4/5] w-[92%] rotate-2" />
          </div>

          <div className="absolute right-[3%] top-1/2 w-48 -translate-y-[78%] xl:right-[6%] xl:w-56 2xl:right-[10%] 2xl:w-64">
            <Foto foto={prega} className="relative aspect-[4/5] w-full rotate-2" />
            <Foto foto={louvor} className="absolute right-[-8%] top-[58%] aspect-[3/4] w-[92%] -rotate-3" />
          </div>
        </div>

        <div className="relative px-6 sm:px-10 lg:w-full lg:px-12 xl:px-20 2xl:px-32">
          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
            <span className="animate-fade-up rounded-full bg-evento-argila px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-evento-branco sm:text-xs sm:tracking-[0.15em]">
              {eventoConfig.nomeIgreja}
            </span>

            <h1 className="animate-fade-up text-balance font-display text-4xl font-semibold leading-[1.05] text-evento-argila sm:text-5xl lg:text-6xl">
              {eventoConfig.temaEvento}
            </h1>

            <div className="animate-fade-up pt-2" style={{ animationDelay: "0.1s" }}>
              <Button
                size="lg"
                asChild
                className="rounded-full bg-evento-argila px-8 text-base font-semibold text-evento-branco hover:bg-evento-argila/90"
              >
                <Link href="/inscricao">inscreva-se</Link>
              </Button>
            </div>

            <div
              className="animate-fade-up flex flex-col items-center gap-1 pt-2"
              style={{ animationDelay: "0.15s" }}
            >
              <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-balance text-sm font-medium text-evento-marrom sm:text-base">
                <span>{eventoConfig.dataEventoExibicao}</span>
                <span className="text-evento-terracota">•</span>
                <span>{eventoConfig.horario}</span>
              </p>
              <p className="text-balance text-sm text-evento-marrom/60">{eventoConfig.endereco}</p>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-xs grid-cols-2 gap-4 sm:max-w-sm lg:hidden">
            <div className="flex flex-col gap-4">
              <Foto foto={oracao} className="aspect-[3/4]" />
              <Foto foto={abraco} className="aspect-[4/5]" />
            </div>
            <div className="flex flex-col gap-4 pt-8">
              <Foto foto={prega} className="aspect-[4/5]" />
              <Foto foto={louvor} className="aspect-[3/4]" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-evento-argila sm:h-20 lg:h-28" />
    </section>
  );
}
