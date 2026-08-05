import { Users, Clock, CheckCircle2, XCircle, Wallet, Armchair } from "lucide-react";

import { eventoConfig } from "@/config/evento";
import { formatarMoeda } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

type Estatisticas = {
  total: number;
  pagamentosPendentes: number;
  pagamentosConfirmados: number;
  inscricoesCanceladas: number;
  valorTotalConfirmado: number;
};

export function DashboardStats({ stats }: { stats: Estatisticas }) {
  const vagasRestantes =
    eventoConfig.limiteVagas !== null
      ? Math.max(eventoConfig.limiteVagas - stats.total, 0)
      : null;

  const itens = [
    { icone: Users, rotulo: "Total de inscrições", valor: stats.total },
    {
      icone: Clock,
      rotulo: "Pagamentos pendentes",
      valor: stats.pagamentosPendentes,
    },
    {
      icone: CheckCircle2,
      rotulo: "Pagamentos confirmados",
      valor: stats.pagamentosConfirmados,
    },
    {
      icone: XCircle,
      rotulo: "Inscrições canceladas",
      valor: stats.inscricoesCanceladas,
    },
    {
      icone: Wallet,
      rotulo: "Valor total confirmado",
      valor: formatarMoeda(stats.valorTotalConfirmado),
    },
    {
      icone: Armchair,
      rotulo: "Vagas disponíveis",
      valor: vagasRestantes !== null ? vagasRestantes : "Sem limite",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((item) => (
        <Card key={item.rotulo}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.rotulo}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {item.valor}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
