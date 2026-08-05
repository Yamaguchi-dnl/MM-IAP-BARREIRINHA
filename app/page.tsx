import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { Programacao } from "@/components/sections/programacao";
import { Convidadas } from "@/components/sections/convidadas";
import { InfoEvento } from "@/components/sections/info-evento";
import { Faq } from "@/components/sections/faq";
import { CtaFinal } from "@/components/sections/cta-final";
import { EventoJsonLd } from "@/components/sections/evento-jsonld";

export default function PaginaInicial() {
  return (
    <>
      <EventoJsonLd />
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Programacao />
        <Convidadas />
        <InfoEvento />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
