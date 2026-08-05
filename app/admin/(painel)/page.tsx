import { Download } from "lucide-react";

import { listarInscricoes, getEstatisticasDashboard } from "@/lib/admin/queries";
import type { StatusInscricao, StatusPagamento } from "@/lib/supabase/database.types";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { FiltrosForm } from "@/components/admin/filtros-form";
import { InscricoesTable } from "@/components/admin/inscricoes-table";

type SearchParams = {
  busca?: string;
  statusPagamento?: StatusPagamento | "todos";
  statusInscricao?: StatusInscricao | "todos";
  cidade?: string;
  igreja?: string;
  pagina?: string;
};

export default async function PaginaAdmin({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filtros = {
    busca: searchParams.busca,
    statusPagamento: searchParams.statusPagamento,
    statusInscricao: searchParams.statusInscricao,
    cidade: searchParams.cidade,
    igreja: searchParams.igreja,
    pagina: searchParams.pagina ? Number(searchParams.pagina) : 1,
  };

  const [stats, resultadoLista] = await Promise.all([
    getEstatisticasDashboard(),
    listarInscricoes(filtros),
  ]);

  const parametrosExportacao = new URLSearchParams();
  if (filtros.busca) parametrosExportacao.set("busca", filtros.busca);
  if (filtros.statusPagamento)
    parametrosExportacao.set("statusPagamento", filtros.statusPagamento);
  if (filtros.statusInscricao)
    parametrosExportacao.set("statusInscricao", filtros.statusInscricao);
  if (filtros.cidade) parametrosExportacao.set("cidade", filtros.cidade);
  if (filtros.igreja) parametrosExportacao.set("igreja", filtros.igreja);

  function montarQueryString(pagina: number) {
    const parametros = new URLSearchParams();
    if (filtros.busca) parametros.set("busca", filtros.busca);
    if (filtros.statusPagamento)
      parametros.set("statusPagamento", filtros.statusPagamento);
    if (filtros.statusInscricao)
      parametros.set("statusInscricao", filtros.statusInscricao);
    if (filtros.cidade) parametros.set("cidade", filtros.cidade);
    if (filtros.igreja) parametros.set("igreja", filtros.igreja);
    parametros.set("pagina", String(pagina));
    return `/admin?${parametros.toString()}`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-evento-marrom">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral das inscrições do evento.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-evento-marrom">
            Inscrições ({resultadoLista.total})
          </h2>
          <a
            href={`/admin/exportar?${parametrosExportacao.toString()}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-input px-4 text-sm font-medium hover:bg-muted/60"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </a>
        </div>

        <FiltrosForm valores={searchParams} />

        <InscricoesTable
          inscricoes={resultadoLista.inscricoes}
          paginaAtual={resultadoLista.pagina}
          totalPaginas={resultadoLista.totalPaginas}
          queryString={montarQueryString}
        />
      </div>
    </div>
  );
}
