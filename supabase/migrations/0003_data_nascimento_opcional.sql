-- Remove a data de nascimento do formulário de inscrição pública.
-- A coluna é removida da tabela; dados de nascimento de inscrições
-- existentes são perdidos permanentemente.

alter table public.inscricoes
  drop column data_nascimento;
