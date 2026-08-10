-- Remove a data de nascimento do formulário de inscrição pública.
-- A coluna deixa de ser obrigatória; registros antigos mantêm o valor.

alter table public.inscricoes
  alter column data_nascimento drop not null;
