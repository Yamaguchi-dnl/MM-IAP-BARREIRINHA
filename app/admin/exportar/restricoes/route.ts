import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { createClient } from "@/lib/supabase/server";
import { getAdminAtual } from "@/lib/admin/queries";
import { RestricoesDocument } from "@/lib/admin/pdf/restricoes-document";
import type { Inscricao } from "@/lib/supabase/database.types";

export async function GET() {
  const admin = await getAdminAtual();

  if (!admin) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("inscricoes")
    .select("*")
    .neq("status_inscricao", "cancelada")
    .order("nome_completo", { ascending: true });

  if (error) {
    return NextResponse.json(
      { erro: "Não foi possível gerar o PDF." },
      { status: 500 },
    );
  }

  const buffer = await renderToBuffer(
    RestricoesDocument({ inscricoes: (data ?? []) as Inscricao[] }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="restricoes-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf"`,
    },
  });
}
