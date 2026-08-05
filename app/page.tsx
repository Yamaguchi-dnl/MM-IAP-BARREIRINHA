import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { EventoJsonLd } from "@/components/sections/evento-jsonld";

export default function PaginaInicial() {
  return (
    <>
      <EventoJsonLd />
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
