-- Ministério de Mulheres IAP Barreirinha — schema inicial
-- Tabelas: inscricoes, administradores, auditoria_inscricoes
-- RLS: acesso de leitura/escrita restrito a administradores autenticados;
-- inserções e consultas públicas passam sempre pela service role key
-- dentro de Server Actions (nunca diretamente do navegador).

create extension if not exists "pgcrypto";

-- ==========================================================
-- Tabela: administradores
-- ==========================================================
create table if not exists public.administradores (
  id uuid primary key references auth.users (id) on delete cascade,
  nome varchar(160) not null,
  email varchar(160) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.administradores enable row level security;

create policy "Administrador vê o próprio registro"
  on public.administradores
  for select
  to authenticated
  using (id = (select auth.uid()));

-- ==========================================================
-- Tabela: inscricoes
-- ==========================================================
create table if not exists public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  codigo varchar(12) not null unique,
  nome_completo varchar(200) not null,
  data_nascimento date not null,
  telefone varchar(20) not null,
  email varchar(200),
  igreja varchar(160),
  cidade varchar(160) not null,
  restricao_alimentar text,
  necessidade_acessibilidade text,
  observacoes text,
  consentimento_privacidade boolean not null default false,
  status_inscricao varchar(30) not null default 'aguardando_pagamento'
    check (status_inscricao in ('aguardando_pagamento', 'confirmada', 'cancelada', 'lista_de_espera')),
  status_pagamento varchar(20) not null default 'pendente'
    check (status_pagamento in ('pendente', 'confirmado', 'isento', 'cancelado')),
  valor_inscricao decimal(10, 2) not null default 0,
  data_confirmacao_pagamento timestamptz,
  observacoes_administrativas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inscricoes_telefone_idx on public.inscricoes (telefone);
create index if not exists inscricoes_codigo_idx on public.inscricoes (codigo);
create index if not exists inscricoes_status_pagamento_idx on public.inscricoes (status_pagamento);
create index if not exists inscricoes_status_inscricao_idx on public.inscricoes (status_inscricao);
create index if not exists inscricoes_cidade_idx on public.inscricoes (cidade);
create index if not exists inscricoes_igreja_idx on public.inscricoes (igreja);

-- Impede inscrições duplicadas pelo mesmo telefone, exceto quando a
-- inscrição anterior foi cancelada.
create unique index if not exists inscricoes_telefone_ativa_idx
  on public.inscricoes (telefone)
  where status_inscricao <> 'cancelada';

alter table public.inscricoes enable row level security;

create policy "Administrador ativo vê inscrições"
  on public.inscricoes
  for select
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

create policy "Administrador ativo atualiza inscrições"
  on public.inscricoes
  for update
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  )
  with check (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

-- Não há policy de INSERT/DELETE para os papéis anon/authenticated:
-- inscrições são criadas apenas via service role (Server Action pública).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inscricoes_set_updated_at on public.inscricoes;
create trigger inscricoes_set_updated_at
  before update on public.inscricoes
  for each row
  execute function public.set_updated_at();

-- ==========================================================
-- Tabela: auditoria_inscricoes
-- ==========================================================
create table if not exists public.auditoria_inscricoes (
  id uuid primary key default gen_random_uuid(),
  inscricao_id uuid not null references public.inscricoes (id) on delete cascade,
  administrador_id uuid references public.administradores (id) on delete set null,
  campo_alterado varchar(60) not null,
  valor_anterior text,
  valor_novo text,
  created_at timestamptz not null default now()
);

create index if not exists auditoria_inscricao_id_idx on public.auditoria_inscricoes (inscricao_id);

alter table public.auditoria_inscricoes enable row level security;

create policy "Administrador ativo vê auditoria"
  on public.auditoria_inscricoes
  for select
  to authenticated
  using (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );

create policy "Administrador ativo registra auditoria"
  on public.auditoria_inscricoes
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.administradores a
      where a.id = (select auth.uid()) and a.ativo = true
    )
  );
