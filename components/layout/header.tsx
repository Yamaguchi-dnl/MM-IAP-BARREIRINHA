import Link from "next/link";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border/70 bg-background">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
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
