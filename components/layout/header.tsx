import Image from "next/image";
import Link from "next/link";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={eventoConfig.logo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-evento-marrom sm:text-xl">
            {eventoConfig.nomeEvento}
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/consultar-inscricao"
            className="hidden text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:inline"
          >
            Consultar inscrição
          </Link>
          <Button asChild size="sm">
            <Link href="/inscricao">Inscreva-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
