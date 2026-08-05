import { eventoConfig } from "@/config/evento";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  if (eventoConfig.faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-evento-fundo-secundario/50 py-20 sm:py-28">
      <div className="container">
        <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" />

        <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-border/70 bg-card px-6">
          <Accordion type="single" collapsible>
            {eventoConfig.faqs.map((faq, index) => (
              <AccordionItem key={faq.pergunta} value={`faq-${index}`}>
                <AccordionTrigger>{faq.pergunta}</AccordionTrigger>
                <AccordionContent>{faq.resposta}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
