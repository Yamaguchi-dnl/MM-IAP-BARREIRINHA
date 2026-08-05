import { eventoConfig } from "@/config/evento";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="bg-evento-fundo-secundario/50 py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Dúvidas frequentes
          </p>
          <h2 className="mt-3 font-display text-3xl text-evento-marrom sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-2xl">
          {eventoConfig.faqs.map((faq) => (
            <AccordionItem key={faq.pergunta} value={faq.pergunta}>
              <AccordionTrigger>{faq.pergunta}</AccordionTrigger>
              <AccordionContent>{faq.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
