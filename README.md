# Site do Evento — Ministério de Mulheres IAP Barreirinha

Landing page com inscrições e painel administrativo para o evento do
Ministério de Mulheres da IAP Barreirinha.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + componentes no padrão **shadcn/ui** (copiados localmente
  em `components/ui`, sem CLI) + **lucide-react**
- **React Hook Form** + **Zod** para validação de formulários
- **Supabase** (Postgres + Auth) como backend
- Geração local do **Pix copia e cola** (BR Code/EMV) e QR Code — sem gateway
  de pagamento
- Deploy sugerido: **Vercel**

> Nota de arquitetura: o projeto foi criado com Next.js 14.2 (e não a versão
> mais recente do framework) para garantir estabilidade e compatibilidade
> total com as bibliotecas usadas (Server Actions, middleware e
> `@supabase/ssr`), evitando mudanças recentes ainda pouco documentadas.

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar um projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode o conteúdo de `supabase/migrations/0001_init.sql`.
   Isso cria as tabelas `inscricoes`, `administradores`,
   `auditoria_inscricoes`, os índices, os triggers e as políticas de RLS.

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os dados do seu
projeto Supabase (**Project Settings → API**):

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — **nunca** exponha esta chave no navegador;
  ela é usada apenas em Server Actions (`lib/supabase/admin.ts`).
- `NEXT_PUBLIC_SITE_URL` — URL pública do site (usada em SEO/Open Graph).

### 4. Criar o primeiro administrador

O cadastro de administradores é sempre manual (não existe cadastro público),
por segurança:

1. No painel do Supabase, vá em **Authentication → Users → Add user** e crie
   um usuário com e-mail e senha reais.
2. Copie o `UID` gerado para esse usuário.
3. No **SQL Editor**, rode (substituindo os valores):

   ```sql
   insert into public.administradores (id, nome, email, ativo)
   values ('UID_DO_USUARIO', 'Nome da administradora', 'email@dominio.com', true);
   ```

4. Acesse `/admin/login` com o e-mail e senha cadastrados.

### 5. Editar os dados do evento

Edite **apenas** o arquivo [`config/evento.ts`](config/evento.ts) — ele
centraliza todos os textos, datas, valores, contatos e dados de Pix
exibidos no site. Campos marcados como `[A_DEFINIR: ...]` precisam ser
substituídos pelos dados reais antes da publicação:

- Nome, tema e descrições do evento
- Data, horário, local e endereço
- Valor da inscrição e limite de vagas (ou `null` para sem limite)
- Prazo de inscrição
- Chave Pix, nome do beneficiário e cidade
- Número de WhatsApp (com DDI+DDD) e Instagram
- Programação, convidadas e perguntas frequentes

Imagens opcionais podem ser adicionadas em `public/` (logo, foto principal e
imagem de compartilhamento social) e referenciadas em `config/evento.ts`. Um
placeholder simples de logo já está em `public/logo.svg`.

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 7. Build de produção

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/                    Páginas (App Router)
  inscricao/            Formulário de inscrição e página de sucesso (Pix)
  consultar-inscricao/  Consulta pública de inscrição
  admin/
    login/              Login administrativo
    (painel)/           Dashboard, lista, filtros, detalhe/edição (protegido)
    exportar/           Route handler de exportação CSV
components/
  ui/                   Componentes de interface (padrão shadcn/ui)
  layout/               Header e footer
  sections/             Seções da landing page
  forms/                Formulários (inscrição, consulta, login, Pix)
  admin/                Componentes do painel administrativo
config/evento.ts         Configuração central e editável do evento
lib/
  supabase/             Clientes Supabase (browser, server, admin/service role)
  actions/              Server Actions (inscrição, consulta, auth, admin)
  admin/                Consultas e exportação CSV usadas pelo painel
  validations/           Schemas Zod
  pix.ts                Geração do payload Pix (BR Code/EMV) local
  codigo.ts             Geração do código curto de inscrição
supabase/migrations/     SQL de schema, índices e RLS
```

## Segurança e privacidade

- RLS habilitado em todas as tabelas. Leitura/edição de inscrições é restrita
  a administradores ativos (`administradores.ativo = true`), validado tanto
  no banco (policies) quanto no servidor (Server Actions/middleware).
- Não existe policy de INSERT pública nas tabelas — a criação de inscrição e
  a consulta pública passam por Server Actions que usam a service role key
  **apenas no servidor**, nunca no navegador.
- O middleware (`middleware.ts`) protege todas as rotas `/admin/*`,
  redirecionando usuários não autenticados para `/admin/login`.
- Páginas administrativas têm `robots: noindex` e `/admin` está bloqueado em
  `robots.ts`.
- O painel permite anonimizar os dados pessoais de uma inscrição (LGPD) sem
  apagar o histórico de auditoria.

## Fluxo de pagamento (Pix manual)

Não há integração com gateway de pagamento. Após a inscrição:

1. A inscrição é salva com pagamento `pendente`.
2. A página de sucesso mostra o valor, o QR Code e o Pix copia e cola
   (gerados localmente a partir da chave configurada).
3. A participante paga pelo app do banco e envia o comprovante por
   WhatsApp (link pré-preenchido com nome e código da inscrição).
4. A administradora confirma manualmente o pagamento no painel — nenhum
   pagamento é confirmado automaticamente.

## Publicação (Vercel)

1. Suba o projeto para um repositório Git.
2. Importe o repositório na [Vercel](https://vercel.com/new).
3. Configure as mesmas variáveis de ambiente de `.env.example` no painel do
   projeto na Vercel (incluindo `NEXT_PUBLIC_SITE_URL` com a URL final).
4. Rode as migrations do Supabase (passo 2 acima) no projeto Supabase de
   produção, se for diferente do usado em desenvolvimento.

## Dados fictícios de desenvolvimento

Nenhum dado fictício de evento, credencial, chave Pix ou WhatsApp foi
inserido no código — todos os campos sensíveis estão como placeholders em
`config/evento.ts` e `.env.example`, para serem preenchidos com os dados
reais antes da publicação.
