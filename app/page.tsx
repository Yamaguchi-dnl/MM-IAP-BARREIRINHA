import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { ParaQuem } from "@/components/sections/para-quem";
import { Programacao } from "@/components/sections/programacao";
import { Faq } from "@/components/sections/faq";
import { InscricaoCta } from "@/components/sections/inscricao-cta";
import { EventoJsonLd } from "@/components/sections/evento-jsonld";
import { Footer } from "@/components/layout/footer";

export default function PaginaInicial() {
  return (
    <>
      <EventoJsonLd />
      <main>
        <Hero />
        <Sobre />
        <ParaQuem />
        <Programacao />
        <Faq />
        <InscricaoCta />
      </main>
      <Footer />
    </>
  );
}
