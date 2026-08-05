import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PixPayment } from "@/components/forms/pix-payment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inscrição recebida",
  robots: { index: false, follow: false },
};

export default function PaginaSucesso({
  searchParams,
}: {
  searchParams: { codigo?: string; nome?: string };
}) {
  const codigo = searchParams.codigo?.trim();
  const nome = searchParams.nome?.trim();

  return (
    <>
      <Header />
      <main className="bg-organic-blob py-16 sm:py-20">
        <div className="container flex justify-center">
          <Card className="w-full max-w-xl">
            <CardContent className="p-8">
              {codigo && nome ? (
                <PixPayment codigo={codigo} nome={nome} />
              ) : (
                <div className="space-y-4 py-8 text-center">
                  <h1 className="font-display text-2xl text-evento-marrom">
                    Não encontramos os dados da sua inscrição
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Use a consulta de inscrição com o código recebido para
                    acessar novamente os dados de pagamento.
                  </p>
                  <Button asChild>
                    <Link href="/consultar-inscricao">
                      Consultar minha inscrição
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
