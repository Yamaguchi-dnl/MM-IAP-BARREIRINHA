import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsultaForm } from "@/components/forms/consulta-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Consultar inscrição",
  robots: { index: false, follow: false },
};

export default function PaginaConsultarInscricao() {
  return (
    <>
      <Header />
      <main className="bg-organic-blob py-16 sm:py-20">
        <div className="container flex justify-center">
          <div className="w-full max-w-xl space-y-6">
            <div className="text-center">
              <h1 className="font-display text-3xl text-evento-marrom">
                Consultar inscrição
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Informe o código recebido e o telefone ou e-mail usados na
                inscrição para acompanhar o status.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <ConsultaForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
