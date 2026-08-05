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
  { src: "/galeria/oracao.jpg", alt: "Mulheres em oração durante o encontro" },
  { src: "/galeria/prega.jpg", alt: "Ministração da palavra no encontro" },
  { src: "/galeria/louvor.jpg", alt: "Momento de louvor no encontro" },
  { src: "/galeria/abraco.jpg", alt: "Abraço entre participantes do encontro" },
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
      <div className="container flex items-center justify-between py-6 lg:grid lg:grid-cols-3">
        <Link href="/" className="flex items-center gap-3 lg:justify-self-start">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-evento-vinho">
            <Image src={eventoConfig.logo} alt={eventoConfig.nomeIgreja} fill className="object-cover" />
          </span>
        </Link>

        <span className="font-display text-sm font-medium tracking-wide text-evento-vinho lg:justify-self-center">
          {eventoConfig.nomeEvento}
        </span>

        <Button
          asChild
          size="sm"
          className="hidden bg-evento-vinho text-evento-branco hover:bg-evento-vinho/90 lg:inline-flex lg:justify-self-end"
        >
          <Link href="/inscricao">inscreva-se</Link>
        </Button>
      </div>

      <div className="container relative py-10 lg:py-20">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <Foto foto={oracao} className="absolute left-0 top-2 aspect-[3/4] w-48 -rotate-3 xl:w-56" />
          <Foto foto={abraco} className="absolute -left-2 bottom-4 aspect-[4/5] w-44 rotate-2 xl:w-52" />
          <Foto foto={prega} className="absolute right-0 top-0 aspect-[4/5] w-48 rotate-2 xl:w-56" />
          <Foto foto={louvor} className="absolute -right-2 bottom-10 aspect-[3/4] w-44 -rotate-3 xl:w-52" />
        </div>

        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <span className="animate-fade-up rounded-full bg-evento-vinho px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-evento-branco sm:text-xs sm:tracking-[0.15em]">
            {eventoConfig.nomeIgreja}
          </span>

          <h1 className="animate-fade-up text-balance font-display text-4xl font-semibold leading-[1.05] text-evento-vinho sm:text-5xl lg:text-6xl">
            {eventoConfig.temaEvento}
          </h1>

          <div className="animate-fade-up pt-2" style={{ animationDelay: "0.1s" }}>
            <Button
              size="lg"
              asChild
              className="rounded-full bg-evento-vinho px-8 text-base font-semibold text-evento-branco hover:bg-evento-vinho/90"
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

        <div className="mt-12 grid grid-cols-2 gap-4 lg:hidden">
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

      <div className="h-2 w-full bg-evento-vinho" />
    </section>
  );
}
