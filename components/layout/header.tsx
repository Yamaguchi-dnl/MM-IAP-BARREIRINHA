"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#programacao", label: "Programação" },
  ...(eventoConfig.convidadas.length > 0
    ? [{ href: "/#convidadas", label: "Convidadas" }]
    : []),
  ...(eventoConfig.faqs.length > 0
    ? [{ href: "/#faq", label: "Dúvidas" }]
    : []),
];

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-serif text-xl font-semibold tracking-tight text-evento-marrom sm:text-2xl">
            {eventoConfig.nomeEvento}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/inscricao">Inscreva-se</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((valor) => !valor)}
        >
          {menuAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background transition-[max-height] duration-300 md:hidden",
          menuAberto ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted/60"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/inscricao"
            onClick={() => setMenuAberto(false)}
            className="mt-2"
          >
            <Button className="w-full">Inscreva-se</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
