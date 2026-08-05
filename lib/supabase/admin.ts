import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Cliente com a service role key. Usado APENAS em Server Actions para os
 * fluxos públicos (criar inscrição e consultar inscrição), que precisam
 * checar duplicidade e vagas antes de existir qualquer sessão de usuário.
 *
 * NUNCA importar este arquivo em código que rode no navegador — o import
 * "server-only" quebra o build caso isso aconteça.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
