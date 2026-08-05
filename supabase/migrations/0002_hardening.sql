-- Corrige search_path mutável na função de trigger e adiciona índice
-- ausente na FK de auditoria_inscricoes.administrador_id.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists auditoria_inscricoes_administrador_id_idx
  on public.auditoria_inscricoes (administrador_id);
